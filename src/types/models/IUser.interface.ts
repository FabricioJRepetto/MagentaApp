import ROLES from "../roles.enum";

export default interface IUser {
    name: string;
    phone: string;
    email: string;
    slack_id: string;
    active: boolean;
    password: string;
    role: ROLES
}