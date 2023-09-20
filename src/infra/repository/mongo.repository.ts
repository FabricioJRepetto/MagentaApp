import { ActivityPayload } from "../../types/ActivityPayload";
import { UserPayload } from "../../types/UserPayload";
import dbRepository from "../../types/db.repository";
import Config from "../models/config.model";
import Logs from "../models/logs.model";
import User from "../models/user.model";

export default class MongoDB implements dbRepository {
    async createLogs(user_id: string): Promise<any> {
        try {
            const response = await Logs.create({
                user: user_id,
                entries: []
            })

            console.log(response);
            return response
        } catch (error: any) {
            console.log(error);
        }
    }

    async createConfig(user_id: string): Promise<any> {
        try {
            const response = await Config.create({
                user: user_id,
                entries: []
            })

            console.log(response);
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async createUser(data: UserPayload): Promise<any> {
        try {
            const response = await User.create(data)
            return response
        } catch (error) {
            console.log(error);
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
        }
    }

    async getUserActivity(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async saveUserActivity(data: ActivityPayload): Promise<any> {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    async checkUserCurrentEvent(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}