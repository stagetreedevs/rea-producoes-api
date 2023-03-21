/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class User extends Document {
    name: string;
    email: string;
    password: string;
    is_user: boolean;
    album: [string];
    created_at: Date;
}