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

    async notify(): Promise<any> {
        try {
            //TODO 
            /**
             * 1- crear una lista de todos los usuarios filtrada por
             *  * el usuario está activo
             *  * el usuario tiene los recordatorios activos
             * 
             *  * estamos dentro de la franja de actividad (dia) 
             *  * estamos dentro de la franja de actividad (hora)
             * 
             *  * ha pasado el tiempo minimo de recordatorio indicado en la config desde el ultimo evento
             *  : no tiene un evento activo actualmente en Google Calendar
             */

            // Usuarios "activos" y con un Slack ID
            const userList: PopulatedUser[] = await this.db.getActiveUsers()

            //: Logica filtrado
            //TODO Refactorizar 

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
                        //: Buscar en Calendar eventos de hoy, hay? paso el tiempo para notificar?
                        //TODO hacer petición de eventos en Google Calendar 
                        //TODO parsear datos 
                        const CalendarEntries: Entry[] = [];
                        if (this.hasToNotify(CalendarEntries, reminder_time)) {
                            //: Agregar promesa a la lista 
                            //TODO crear un message View con boton para registrar 
                            idList.push(user.slack_id!)
                            promises.push(
                                this.slack.sendMessage(user.slack_id!, { text: `${user.name} es hora de registrar tu actividad! \n¿Qué fue lo último que hiciste? \nUtiliza \\Actividad para registrar una actividad.` })
                            )
                        }
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
        const day = new Date().toLocaleDateString('en-Us'),
            month = new Date().getMonth(),
            year = new Date().getFullYear();

        // Buscamos una entrada con la fecha actual (mes-año)
        const targetMonth: Entry | undefined = entries.find(e => e.month === month && e.year === year)

        if (targetMonth) { // Buscamos un día con la fecha actual
            const targetDay = targetMonth.days.find(d => d.date === day)

            if (targetDay) { // buscamos el ultimo evento
                const lastActivity = this.lastActivity(targetDay.activity)

                return this.isTimeToRemind(lastActivity, reminder_time)
            }
        }

        return true // hay que notificar
    }

    /**
     * Determina si transcurrio el tiempo especificado por el usuario para recibir una notificación.
     * 
     * @param time Hora de finalización de un evento
     * @param reminder_time Horas minimas que deben transcurrir entre cada notificación. Determinado por la configuración del usuario.
     * @returns true: hay que notificar; false: no hay que notificar aún;
     */
    private isTimeToRemind(activity: Activity | null, reminder_time: number): Boolean {
        if (!activity) return true

        const now = new Date().getHours()
        if (activity.hours.to + reminder_time >= now) return true

        return false
    }

    private lastActivity(entries: Activity[]): Activity | null {
        let later: number = 0;
        let aux: Activity | null = null;

        for (const activity of entries) {
            const end: number = activity.hours.to;

            if (end >= later) {
                later = end;
                aux = activity;
            }
        }

        return aux;
    }
}