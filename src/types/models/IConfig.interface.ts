import { Types } from "mongoose";

export default interface IConfig {
    user: Types.ObjectId;
    user_slack_id?: string;
    active_hours: {
        from: number,
        to: number
    };
    active_days: Types.Array<number>;
    notification: boolean;
    reminder_time: number;
}

export interface Config {
    active_hours: {
        from: number,
        to: number
    };
    active_days: number[];
    notification: boolean;
    reminder_time: number;
}