import { Schema, model } from "mongoose";
import ILogs, { Entry, Activity } from "../../types/models/ILogs.interface";

const activitySchema = new Schema<Activity>(
    {
        date: { type: String },
        hours: {
            from: { type: Number },
            to: { type: Number }
        },
        description: { type: String },
        category: { type: String },
        subcategory: { type: String },
        energy: { type: Number },
        emotion: { type: String },
        gc_event_id: { type: String }
    }
)
const entriesSchema = new Schema<Entry>(
    {
        month: { type: Number },
        year: { type: Number },
        days: [
            {
                date: { type: String },
                activity: [activitySchema]
            }
        ]
    }
)

const logsSchema = new Schema<ILogs>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        user_slack_id: { type: String },
        entries: [entriesSchema]
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

export default model<ILogs>('Logs', logsSchema);