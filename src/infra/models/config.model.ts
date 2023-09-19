import { Schema, model } from "mongoose";
import IConfig from "../../types/models/IConfig.interface";

const configSchema = new Schema<IConfig>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    active_period: {
        from: { type: String },
        to: { type: String }
    },
    reminder_time: { type: Number, default: 1 }
})

export default model<IConfig>('Configuration', configSchema)