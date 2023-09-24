import { FilterQuery } from "mongoose";
import { ActivityPayload } from "../../types/ActivityPayload";
import { UserPayload } from "../../types/UserPayload";
import IdbRepository from "../../types/db.repository.interface";
import IConfig, { Config as ConfigPayload } from "../../types/models/IConfig.interface";
import { Activity, Day, Entry } from "../../types/models/ILogs.interface";
import Config from "../models/config.model";
import Logs from "../models/logs.model";
import User from "../models/user.model";

export default class MongoDB implements IdbRepository {

    async createLogs(user_id: string, slack_id: string): Promise<any> {
        try {
            const logs = await Logs.create({
                user: user_id,
                user_slack_id: slack_id,
                entries: []
            })

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

    async createConfig(user_id: string, slack_id: string): Promise<any> {
        try {
            const config = await Config.create({
                user: user_id,
                user_slack_id: slack_id
            })

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

    async createUser(data: UserPayload): Promise<any> {
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

    async getUserWithConfig(user_id: string): Promise<any> {
        try {
            let user;
            if (user_id.length === 24) {
                user = await User.findById(user_id).populate("config")
            } else {
                user = await User.findOne({ slack_id: user_id }).populate("config")
            }

            return user;
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async getUserWithLogs(user_id: string): Promise<any> {
        try {
            let user;
            if (user_id.length === 24) {
                user = await User.findById(user_id).populate("logs")
            } else {
                user = await User.findOne({ slack_id: user_id }).populate("logs")
            }

            return user;
        } catch (error) {
            console.log(error);
            return Promise.reject(error)
        }
    }

    async getPopulatedUser(user_id: string): Promise<any> {
        try {
            let user;
            if (user_id.length === 24) {
                user = await User.findById(user_id)
                    .populate("logs")
                    .populate("config")
            } else {
                user = await User.findOne({ slack_id: user_id })
                    .populate("logs")
                    .populate("config")
            }

            return user;
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
            //TODO Refactor:
            //* A_ añadir slack_id al esquema de logs para ahorrar una consulta a la DB
            //: B_ enviar la ID de usuario al modal?
            // const user = await User.findOne({ slack_id: user_id }) // Buscamos id del usuario utilizando su slack_id
            // if (!user) {
            //     throw new Error("Wrong user slack_id");
            // }

            let logs = await Logs.findOne({ user_slack_id: user_id }) // Buscamos los Logs del usuario utilizando su _id
            if (!logs) {
                throw new Error("Wrong user slack_id");
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