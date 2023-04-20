/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Folder extends Document {
    name: string;
	images: [string];
    created_at: Date;
}