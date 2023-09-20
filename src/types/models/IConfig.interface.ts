import { Types } from "mongoose";

export default interface IConfig {
    user: Types.ObjectId;
    active_hours: {
        from: string,
        to: string
    };
    active_days: Types.Array<number>;
    reminder_time: number;
}