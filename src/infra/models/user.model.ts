import { Schema, model } from 'mongoose';
import IUser from "../../types/models/IUser.interface";
import ROLES from '../../types/models/roles.enum';

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        config: { type: Schema.Types.ObjectId, ref: "Configuration" },
        logs: { type: Schema.Types.ObjectId, ref: "Logs" },
        username: { type: String },
        picture: { type: String },
        google_id: { type: String },
        slack_id: { type: String },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        active: { type: Boolean, default: true },
        password: { type: String },
        role: { type: String, default: ROLES.USER }
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

export default model<IUser>('User', userSchema);