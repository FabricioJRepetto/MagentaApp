import { Schema, model } from "mongoose";
import ILogs from "../../types/models/ILogs.interface";

const logsSchema = new Schema<ILogs>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    entries: [
        {
            month: { type: String },
            days: [
                {
                    date: { type: String },
                    activity: [
                        {
                            date: { type: String },
                            hours: {
                                from: { type: String },
                                to: { type: String }
                            },
                            category: { type: String },
                            subcategory: { type: String },
                            energy: { type: Number },
                            emotion: { type: String },
                            gc_event_id: { type: String }
                        }
                    ]
                }
            ]
        }
    ]
});

export default model<ILogs>('Logs', logsSchema);