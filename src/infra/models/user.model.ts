import { Schema, model } from 'mongoose';
import IUser from "../../types/models/IUser.interface";
import ROLES from '../../types/roles.enum';

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    slack_id: { type: String, required: true },
    active: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, default: ROLES.USER }
});

export default model<IUser>('User', userSchema);