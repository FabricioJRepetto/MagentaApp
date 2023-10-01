import { Config } from "../models/IConfig.interface";
import ILogs from "../models/ILogs.interface";

export interface signinRes {
    error: boolean;
    message: string;
    token?: string;
    user?: parsedUser;
    logs?: ILogs;
    config?: Config;
}

export interface parsedUser {
    _id: string;
    google_id: string;
    slack_id?: string;
    email: string;
    name: string;
    role: string;
    picture: string | undefined;
}
