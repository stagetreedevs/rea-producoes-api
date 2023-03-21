/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Admin extends Document {
    email: string;
    password: string;
    is_admin: boolean;
    created_at: Date;
}