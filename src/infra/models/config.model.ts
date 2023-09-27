import { Schema, model } from "mongoose";
import IConfig from "../../types/models/IConfig.interface";

const configSchema = new Schema<IConfig>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        user_slack_id: { type: String, required: true },
        active_hours: {
            from: { type: Number, default: 9 },
            to: { type: Number, default: 21 }
        },
        active_days: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
        notification: { type: Boolean, default: true },
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