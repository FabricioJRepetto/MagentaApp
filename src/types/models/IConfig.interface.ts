import { Types } from "mongoose";

export default interface IConfig {
    user: Types.ObjectId;
    user_slack_id: string;
    active_hours: {
        from: string,
        to: string
    };
    active_days: Types.Array<number>;
    reminder_time: number;
}