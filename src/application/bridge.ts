/**
 * Implementación de la lógica de los controladores
 * Mediador entre controlador/endpoint y repositorio
 */

import MongoDB from "../infra/repository/mongo.repository"
import SlackAPI from "../infra/repository/slack.api.repository";
import { UserPayload } from "../types/UserPayload";
import { User, UserValues, ActivityValues, ConfigValues } from "../types/ViewSubmissionPayload";
import dbRepository from "../types/db.repository.interface";
import IConfig, { Config } from "../types/models/IConfig.interface";
import { Activity } from "../types/models/ILogs.interface";
import IUser from "../types/models/IUser.interface";

export default class Bridge extends SlackAPI {
    private db: dbRepository;
    // public slack: ISlackAPI;

    constructor() {
        super()
        this.db = new MongoDB();
        // this.slack = new SlackAPI();
    }

    public newUser = async ({ user, values }: { user: User, values: UserValues }) => {
        try {
            const userExists = await this.db.getUser(user.id)
            if (userExists) {
                return userExists
            }

            //TODO validar datos 
            const data = this.parseUserData({ user, values })

            const result = await this.db.createUser(data)

            if (result?._id) {
                await this.db.createConfig(result._id, user.id)
                await this.db.createLogs(result._id, user.id)
            }

            console.log(result);
            return result;
        } catch (error) {
            console.log('error @ Bridge.newUser()', error);
            return error
        }
    }

    async newActivity({ user, values }: { user: User; values: ActivityValues; }) {
        try {
            //TODO validar datos 
            const data = this.parseActivityData({ values });

            //TODO recibir fechas o definir por defecto 
            const day = new Date().toLocaleDateString('en-Us');
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

            const result = await this.db.saveUserActivity(user.id, data, { day, month, year });


        } catch (error) {
            console.log('error @ Bridge.newActivity()', error);
            return error
        }
    }

    async getUser(user_id: string): Promise<IUser | undefined> {
        try {
            const user = await this.db.getUser(user_id);
            return user;
        } catch (error) {
            console.log('error @ Bridge.getUser()', error);
            return undefined
        }
    }

    /**
     * Busca un usuario y popula el campo indicado o todos los campos posibles.
     * 
     * @param user_id Db User ID or Slack ID
     * @param path_to_populate "config" o "logs", dejar vacio para popular ambos campos
     * @returns 
     */
    async getPopulatedUser(user_id: string, path_to_populate?: "config" | "logs"): Promise<IUser | undefined> {
        try {
            let user;

            switch (path_to_populate) {
                case 'config':
                    user = await this.db.getUserWithConfig(user_id);
                    break;

                case 'logs':
                    user = await this.db.getUserWithLogs(user_id);
                    break;

                default:
                    user = await this.db.getPopulatedUser(user_id);
                    break;
            }
            return user;

        } catch (error) {
            console.log('error @ Bridge.getPopulatedUser()', error);
            return undefined
        }
    }

    async getUserConfig(user_slack_id: string): Promise<IConfig | undefined> {
        try {
            const config = await this.db.getUserConfig(user_slack_id)
            console.log(config);

            return config

        } catch (error) {
            console.log('error @ Bridge.getUserConfig()', error);
            return undefined
        }
    }

    async editConfig({ user_id, values }: { user_id: string; values: ConfigValues; }) {
        try {
            //TODO validar datos 
            const data = this.parseConfigData({ values });
            await this.db.updateUserConfig(user_id, data)
            return
        } catch (error) {
            console.log('error @ Bridge.editConfig()', error);
            return error
        }

    }

    //________________________________________________________

    private parseUserData = ({ user, values }: { user: User, values: UserValues }): UserPayload => {
        try {
            const data = {
                name: values.name.name_input.value,
                email: values.email.email_input.value,
                phone: values.phone.phone_input.value,
                username: user.username,
                slack_id: user.id
            }

            return data;
        } catch (error: any) {
            console.log('error @ parseUserData()', error);
            throw new Error(error);
        }
    }

    private parseActivityData = ({ values }: { values: ActivityValues }): Activity => {
        try {
            const data: Activity = {
                date: new Date().toISOString().split('T')[0],
                hours: {
                    from: values.time_from.from.selected_time,
                    to: values.time_to.to.selected_time
                },
                category: values.category.category_select.selected_option.value,
                subcategory: values.subcategory.subcategory_select.selected_option.value,
                energy: parseInt(values.energy.energy_select.selected_option.value),
                emotion: values.emotion.emotion_select.selected_option.value,
                description: values.description.taskTitle.value
            }

            return data
        } catch (error: any) {
            console.log('error @ parseData()', error);
            throw new Error(error);
        }
    }

    private parseConfigData = ({ values }: { values: ConfigValues }): Config => {
        try {
            const data: Config = {
                active_hours: {
                    from: values.time_from.from.selected_time,
                    to: values.time_to.to.selected_time
                },
                active_days: values.days.selected_days.selected_options.map(e => parseInt(e.value)),
                reminder_time: parseInt(values.reminder.reminder_select.selected_option.value)
            }

            return data
        } catch (error: any) {
            console.log('error @ parseData()', error);
            throw new Error(error);
        }
    }
}