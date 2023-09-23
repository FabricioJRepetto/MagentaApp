/**
 * Implementación de la lógica de los controladores
 * Mediador entre controlador/endpoint y repositorio
 */

import MongoDB from "../infra/repository/mongo.repository"
import SlackAPI from "../infra/repository/slack.api.repository";
import { UserPayload } from "../types/UserPayload";
import { User, UserValues, ActivityValues } from "../types/ViewSubmissionPayload";
import dbRepository from "../types/db.repository.interface";
import IConfig from "../types/models/IConfig.interface";
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

    async getUserConfig(user_slack_id: string): Promise<IConfig | undefined> {
        try {
            const config = await this.db.getUserConfig(user_slack_id)

        } catch (error) {
            console.log('error @ Bridge.getUserConfig()', error);
            return undefined
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
            const data = {
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
}