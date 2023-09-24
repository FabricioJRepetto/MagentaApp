import { Schema, model } from "mongoose";
import IConfig from "../../types/models/IConfig.interface";

const configSchema = new Schema<IConfig>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        user_slack_id: { type: String, required: true },
        active_hours: {
            from: { type: String, default: "09:00" },
            to: { type: String, default: "21:00" }
        },
        active_days: { default: [0, 1, 2, 3, 4, 5, 6] },
        reminder_time: { type: Number, default: 1 }
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
)

export default model<IConfig>('Configuration', configSchema)