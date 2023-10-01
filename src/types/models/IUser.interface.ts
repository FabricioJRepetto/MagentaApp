import { Types } from "mongoose";
import ROLES from "./roles.enum";
import IConfig from "./IConfig.interface";
import ILogs from "./ILogs.interface";

export default interface IUser {
    name: string;
    config?: Types.ObjectId;
    logs?: Types.ObjectId;
    username?: string;
    phone?: string;
    email: string;
    picture?: string;
    google_id?: string;
    slack_id?: string;
    active: boolean;
    password?: string;
    role: ROLES
}

export interface PopulatedUser {
    id: string;
    name: string;
    config: IConfig | Types.ObjectId;
    logs: ILogs | Types.ObjectId;
    username?: string;
    phone?: string;
    email: string;
    profile_picture?: string;
    google_id?: string;
    slack_id?: string;
    active: boolean;
    password?: string;
    role: ROLES
}