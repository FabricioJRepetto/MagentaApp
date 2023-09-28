import { FilterQuery } from "mongoose";
import { ActivityPayload } from "../../types/ActivityPayload";
import { UserPayload } from "../../types/UserPayload";
import IdbRepository, { AtLeastOneRefCreationArg } from "../../types/db.repository.interface";
import IConfig, { Config as ConfigPayload } from "../../types/models/IConfig.interface";
import { Activity, Day, Entry } from "../../types/models/ILogs.interface";
import Config from "../models/config.model";
import Logs from "../models/logs.model";
import User from "../models/user.model";
import IUser, { PopulatedUser } from "../../types/models/IUser.interface";

export default class MongoDB implements IdbRepository {

    async getAllUsers(): Promise<any> {
        try {
            const userList = await User.find()
                .populate("config")
                .populate("logs")

            return userList

        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async getActiveUsers(): Promise<any> {
        try {
            //TODO Filtrar lo más posible en la query 
            const userList = await User.find(
                {
                    active: true,
                    slack_id: { $exists: true }
                })
                .populate("config")
                .populate("logs")

            return userList

        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async createLogs(user_id: string, arg: AtLeastOneRefCreationArg): Promise<any> {
        try {
            const data = {
                user: user_id,
                entries: [],
                ...arg
            }

            const logs = await Logs.create(data)

            //? update ref on User
            await User.findByIdAndUpdate(user_id,
                {
                    $set: {
                        logs: logs._id
                    }
                }
            )

            return logs
        } catch (error: any) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async createConfig(user_id: string, arg: AtLeastOneRefCreationArg): Promise<any> {
        try {
            const data = {
                user: user_id,
                ...arg
            }

            const config = await Config.create(data)

            //? update ref on User
            await User.findByIdAndUpdate(user_id,
                {
                    $set: {
                        config: config._id
                    }
                }
            )

            return config
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async createSlackUser(data: UserPayload): Promise<any> {
        try {
            const response = await User.create(data)
            return response
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async createGoogleUser(data: { name: string, email: string }): Promise<any> {
        try {
            const response = await User.create(data)
            return response
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async getUser(user_id: string): Promise<any> {
        try {
            let user;
            if (user_id.length === 24) {
                user = await User.findById(user_id)
            } else {
                user = await User.findOne({ slack_id: user_id })
            }
            return user;

        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async getUserByEmail(email: string): Promise<any> {
        try {
            return await User.findOne({ email })

        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    /**
     * Busca un usuario y lo devuelve junto con su Configuración
     * 
     * @param user_id Db user ID o Slack ID
     * 
     * @returns Retorna un documento de usuario con el campo Config populado o undefined si no se encuentra un usuario
     */
    async getUserWithConfig(user_id: string): Promise<any> {
        try {
            if (user_id.length === 24) {
                return await User.findById(user_id).populate("config")
            } else {
                return await User.findOne({ slack_id: user_id }).populate("config")
            }
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    /**
     * Busca un usuario y lo devuelve junto con su historial de Logs
     * 
     * @param user_id Db user ID o Slack ID
     * 
     * @returns Retorna un documento de usuario con el campo Logs populado o undefined si no se encuentra un usuario
     */
    async getUserWithLogs(user_id: string): Promise<any> {
        try {
            if (user_id.length === 24) {
                return await User.findById(user_id).populate("logs")
            } else {
                return await User.findOne({ slack_id: user_id }).populate("logs")
            }
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    /**
     * Busca un usuario y lo devuelve junto con su Configuración e historial de Logs
     * 
     * @param user_id Db user ID o Slack ID
     * 
     * @returns Retorna un documento de usuario con campos populado o undefined si no se encuentra un usuario
     */
    async getPopulatedUser(user_id: string): Promise<any> {
        try {
            if (user_id.length === 24) {
                return await User.findById(user_id)
                    .populate("logs")
                    .populate("config")
            } else {
                return await User.findOne({ slack_id: user_id })
                    .populate("logs")
                    .populate("config")
            }
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    getUserWeek(user_id: string, date: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserMonth(user_id: string, date: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserLogs(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getUserConfig(user_id: string): Promise<any> {
        try {
            const filter = user_id.length === 24 ? { user: user_id } : { user_slack_id: user_id };
            const config = await Config.findOne(filter)
            return config;
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async updateUserConfig(user_id: string, data: ConfigPayload): Promise<any> {
        try {
            const { active_hours, active_days, reminder_time } = data;
            const filter = user_id.length === 24 ? { user: user_id } : { user_slack_id: user_id };

            const updatedConfig = await Config.findOneAndUpdate(filter,
                {
                    $set: {
                        active_hours,
                        active_days,
                        reminder_time
                    }
                },
                {
                    new: true
                }
            )
            return updatedConfig;

        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async saveUserActivity(user_id: string, data: Activity, date: { day: string, month: number, year: number }): Promise<any> {
        try {
            let logs = await Logs.findOne({ user_slack_id: user_id }) // Buscamos los Logs del usuario utilizando su user_slack_id
            if (!logs) {
                throw new Error("Wrong user_slack_id");
            }


            //? Logica para saber donde guardar la actividad
            // Checkeamos si hay una entrada con la fecha indicada
            let targetMonth: Entry | undefined = logs.entries.find(e => e.month === date.month && e.year === date.year)

            if (targetMonth) { // Buscamos ua lista de actividades con la fecha indicada
                let targetDay = targetMonth.days.find(day => day.date === date.day)

                if (targetDay) { // Si existe fecha, guardar data
                    targetDay.activity.push(data)

                } else { // No existe entrada, crear nueva (fecha) y guardar data
                    const newDay: Day = {
                        date: date.day,
                        activity: [data]
                    }
                    targetMonth.days.push(newDay)
                }
            } else { // No existe entrada, crear nueva (mes/año) y guardar data
                const newDay: Day = {
                    date: date.day,
                    activity: [data]
                }
                const newEntry: Entry = {
                    month: date.month,
                    year: date.year,
                    days: [newDay]
                }
                logs.entries.push(newEntry)
            }

            await logs.save()

        } catch (error) {
            console.log('error @ MongoDB.saveUserActivity', error);
            return Promise.reject(error)
        }
    }

    async checkUserCurrentEvent(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    syncGoogleCalendar(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}