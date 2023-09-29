/**
 * Implementación de la lógica de los controladores de la API
 * Mediador entre controlador/endpoint y repositorio
 */

import MongoDB from "../infra/repository/mongo.repository"
import SlackAPI from "../infra/repository/slack.api.repository";
import ISlackAPI from "../types/slack.api.interface";
import dbRepository from "../types/db.repository.interface";
import { PopulatedUser } from "../types/models/IUser.interface";
import IConfig from "../types/models/IConfig.interface";
import ILogs, { Activity, Day, Entry } from "../types/models/ILogs.interface";
import { notificationMessage } from "../infra/slack-resources/user-interface/messages";
import { findDayLogs, getYesterdayDate, isBussy, previousEvent } from "./utils";

export default class Bridge {
    private db: dbRepository;
    public slack: ISlackAPI;

    constructor() {
        this.db = new MongoDB();
        this.slack = new SlackAPI();
    }

    /**
     * Crea un nuevo usuario a partir de un login de Google
     * 
     * @param param Un objeto con las propiedades user y values
     * @returns 
     */
    public newGoogleUser = async (payload: any) => {
        try {
            const {
                email,
                name
            } = payload;

            const userExists = await this.db.getUserByEmail(email)
            if (userExists) {
                //TODO Si ya existe actualizar con datos faltantes 
                return userExists
            }

            const result = await this.db.createGoogleUser(payload)

            if (result?._id) {
                await this.db.createConfig(result._id, { email })
                await this.db.createLogs(result._id, { email })

                return `✅ Registro de usuario exitoso. Bienvenido ${name.split(" ")[0]}!`
            } else {
                return "🤔 Algo salió mal..."
            }
        } catch (error) {
            console.log('error @ Bridge.newGoogleUser()', error);
            return error
        }
    }

    /**
     * 
     * @returns Retorna todos los usuarios registrados en la base de datos
     */
    async getAllUsers(): Promise<any> {
        try {
            const users = await this.db.getAllUsers();
            return users;

        } catch (error) {
            console.log('error @ Bridge.getAllUsers()', error);
            return undefined
        }
    }

    /**
     * Busca los usuarios que cumplen los criterios para ser notificados y les envia una notificación a Slack.
     * Los usuarios seleccionados deben estar "activos", tener una ID de Slack asociada 
     * y cumplir las especificaciones seteadas en su configuración.
     * 
     * @returns cantidad de envios de notificaciones exitosos y fallidos.
     */
    async notify(): Promise<any> {
        try {
            // Usuarios "activos" y con un Slack ID
            const userList: PopulatedUser[] = await this.db.getActiveUsers()

            //: Logica filtrado
            let promises: Promise<any>[] = [];
            let idList: String[] = [];
            const today = new Date().getDay();

            for (const user of userList) {
                const { active_hours, active_days, reminder_time } = <IConfig>user?.config;
                const { entries } = <ILogs>user?.logs;

                //: Día y Horarios de actividad
                if (active_days.includes(today) && this.inActiveHours(active_hours)) {

                    //: Buscar en Logs de hoy, hay? paso el tiempo para notificar?
                    if (this.hasToNotify(entries, reminder_time)) {

                        //: Agregar promesa a la lista 
                        //TODO crear un message View con boton para registrar 
                        idList.push(user.slack_id!)
                        promises.push(
                            this.slack.sendMessage(user.slack_id!, { blocks: notificationMessage(user.name.split(" ")[0]) })
                        )

                        //: Google Calendar ?                        
                    }
                }
            }

            //: Completar promesas y responder
            let response = {
                fulfilled: 0,
                rejected: 0,
                idList
            }
            const promiseAll = await Promise.allSettled(promises)
            promiseAll.forEach((result) => response[result.status] += 1)

            return response

        } catch (error) {
            console.log('error @ Bridge.openHome()', error);
            return error
        }
    }

    //_____________________________________________________

    /**
     * Chequea si la hora actual corresponde a la franja horaria de actividad del usuario.
     * 
     * @param config un objeto con las porpiedades de hora de inicio y final de actividades representadas como un entero entre 0 y 23.
     * @returns Retorna un booleano.
     */
    private inActiveHours = ({ from, to }: { from: number, to: number }): Boolean => {
        const now = new Date().getHours();

        if (from < to) {
            // ejemplo: 9am - 18pm
            return now > from && now <= to
        } else {
            // ejemplo: 13pm - 1am
            return now > from || now <= to
        }
    }

    /**
     * Busca la ultima actividad por orden cronológico y verifica que haya transcurrido el tiempo mínimo para notificar.
     * Retorna true si no hay actividades o el tiempo para notificar ya ha transcurrido desde la finalización del ultimo evento,
     * en caso contrario retorna false.
     * 
     * @param entries Lista de entradas (Logs) del usuario
     * @returns Boolean
     */
    private hasToNotify(entries: Entry[], reminder_time: number): Boolean {
        const now = new Date().getHours(),
            day = new Date().toLocaleDateString('en-Us');

        const targetDay: Day | null = findDayLogs(day, entries);
        const yesterday: Day | null = findDayLogs(getYesterdayDate(), entries);

        if (targetDay) {
            if (isBussy(targetDay.activity)) { // verificamos si hay evento en curso
                return false // Si hay, no enviar notificación

            } else { // Si no hay, buscar el evento anterior
                const prev = previousEvent(targetDay.activity, yesterday ? yesterday.activity : [])

                // si no hay evento anterior o si pasó el tiempo requerido: notificar
                if (prev === null || prev?.hours.to <= now - reminder_time) {
                    return true;
                }
                // el ultimo evento es del dia anterior
                if (new Date(prev.date) < new Date(day)) {
                    // checkear tiempo transcurrido desde ayer
                    if (23 - prev.hours.to + now >= reminder_time) {
                        return true;
                    }
                }
                // si hay evento y no paso el tiempo: no notificar
                return false;
            }
        } else if (yesterday) { // Si hay "ayer" checkear su ultimo evento
            const prev = previousEvent(yesterday.activity)

            // si no hay evento anterior o si pasó el tiempo requerido
            if (prev === null || 23 - prev.hours.to + now >= reminder_time) {
                return true;
            }
            // si hay evento y no paso el tiempo: no notificar
            return false
        }

        return true // hay que notificar
    }
}