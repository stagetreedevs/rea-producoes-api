/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Key extends Document {
    album: string;
    value: string;
    expirationDate: Date;
    created_at: Date;
}