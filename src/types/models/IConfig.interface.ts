import { Types } from "mongoose";

export default interface IConfig {
    user: Types.ObjectId;
    active_period: {
        from: string,
        to: string
    };
    reminder_time: number;
}