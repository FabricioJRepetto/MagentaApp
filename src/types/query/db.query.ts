import IUser from "../models/IUser.interface";

export interface dbUser extends IUser {
    id: string
}