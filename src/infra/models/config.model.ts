import { Number, Schema, model } from "mongoose";
import IConfig from "../../types/models/IConfig.interface";

const configSchema = new Schema<IConfig>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    active_hours: {
        from: { type: String },
        to: { type: String }
    },
    active_days: [0, 1, 2, 3, 4, 5, 6],
    reminder_time: { type: Number, default: 1 }
})

export default model<IConfig>('Configuration', configSchema)