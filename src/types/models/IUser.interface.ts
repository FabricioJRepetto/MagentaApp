import { Types } from "mongoose";
import ROLES from "../roles.enum";
import IConfig from "./IConfig.interface";
import ILogs from "./ILogs.interface";

export default interface IUser {
    name: string;
    config?: Types.ObjectId;
    logs?: Types.ObjectId;
    username?: string;
    phone: string;
    email: string;
    slack_id: string;
    active: boolean;
    password?: string;
    role: ROLES
}

export interface PupulatedUser {
    name: string;
    config: IConfig | Types.ObjectId;
    logs: ILogs | Types.ObjectId;
    username?: string;
    phone: string;
    email: string;
    slack_id: string;
    active: boolean;
    password?: string;
    role: ROLES
}