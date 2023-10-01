import { PopulatedUser } from "../models/IUser.interface";

export interface populatedUserRes {
    error: boolean;
    message: string;
    user?: PopulatedUser;
}