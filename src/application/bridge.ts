/**
 * Implementación de la lógica de los controladores
 * Mediador entre controlador/endpoint y repositorio
 */

import MongoDB from "../infra/repository/mongo.repository"
import { UserPayload } from "../types/UserPayload";
import { User, UserValues } from "../types/ViewSubmissionPayload";
import dbRepository from "../types/db.repository";

export default class Bridge {
    private db: dbRepository;

    constructor() {
        this.db = new MongoDB();
    }

    public newUser = async ({ user, values }: { user: User, values: UserValues }) => {
        try {
            const userExists = await this.db.getUser(user.id)
            if (userExists) {
                return userExists
            }

            const data = this.parseUserData({ user, values })
            //TODO validar datos 

            const result = await this.db.createUser(data)

            if (result?._id) {
                await this.db.createConfig(result._id)
                await this.db.createLogs(result._id)
            }

            console.log(result);
            return result;
        } catch (error) {
            console.log('error @ Bridge.newUser()', error);
            return error
        }
    }

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
}