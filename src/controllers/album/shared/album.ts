/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Album extends Document {
    name: string;
	cover: string;
	galery: [string];
    created_at: Date;
}