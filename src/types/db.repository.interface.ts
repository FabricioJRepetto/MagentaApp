import { UserPayload } from "./UserPayload"
import { Config } from "./models/IConfig.interface"
import { Activity } from "./models/ILogs.interface"
import IUser from "./models/IUser.interface"

export default interface IdbRepository {
    /**
     * 
     * @param user_id Puede ser la ID de la base de datos o Slack ID
     */
    getUserConfig(user_id: string): Promise<any>
    /**
     * Actualiza las preferencias de un usuario.
     * 
     * @param user_id ID de base de datos o ID de Slack
     * @param data objeto con los parametros necesarios (interface Config)
     */
    updateUserConfig(user_id: string, data: Config): Promise<any>
    createLogs(user_id: string, slack_id: string): Promise<any>
    createConfig(user_id: string, slack_id: string): Promise<any>
    createUser(data: UserPayload): Promise<any>
    /**
     * Busca un usuario por ID o por SLACK ID
     * 
     * @param user_id ID de base de datos o ID de Slack 
     * @returns 
     */
    getUser(user_id: string): Promise<any>
    getUserWithConfig(user_id: string): Promise<any>
    getUserWithLogs(user_id: string): Promise<any>
    getPopulatedUser(user_id: string): Promise<any>
    /**
     * Guarda una nueva actividad. La fecha en la que se registra es la misma que la fecha de recepción de la petición.
     * 
     * @param user_id Slack ID
     * @param data Objeto parseado y listo para ser guardado en la DB
     * @param date Objeto con las propiedades 'month' y 'year' expresadas en enteros y 'day' como cadena de caracteres, ej.: "9/21/2023" (new Date().toLocaleDateString('en-Us'))
     */
    saveUserActivity(user_id: string, data: Activity, date: { day: string, month: number, year: number }): Promise<any>
    checkUserCurrentEvent(user_id: string): Promise<any>
    /**
     * Retorna la actividad de una semana especifica
     * 
     * @param user_id ID de base de datos
     * @param date Fecha para determinar semana
     */
    getUserWeek(user_id: string, date: string): Promise<any>
    /**
     * Retorna la actividad de un mes especifico
     * 
     * @param user_id ID de base de datos
     * @param date Mes+año. Ej.: "3-23"
     */
    getUserMonth(user_id: string, date: string): Promise<any>
    /**
     * Retorna todas las actividades registradas
     * 
     * @param user_id ID de base de datos
     */
    getUserLogs(user_id: string): Promise<any>

    syncGoogleCalendar(user_id: string): Promise<any>
}