import { ActivityPayload } from "../../types/ActivityPayload";
import { UserPayload } from "../../types/UserPayload";
import dbRepository from "../../types/db.repository";
import User from "../models/user.model";

export default class MongoDB implements dbRepository {

    async createUser(data: UserPayload): Promise<any> {
        try {
            const response = await User.create(data)
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getUser(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getUserActivity(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async saveActivity(data: ActivityPayload): Promise<any> {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    async checkUserCurrentEvent(user_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}