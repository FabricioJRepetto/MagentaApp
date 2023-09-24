import { Types } from "mongoose";
import ROLES from "../roles.enum";

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