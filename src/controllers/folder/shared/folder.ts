/* eslint-disable prettier/prettier */
import { Document } from "mongoose";
export class Folder extends Document {
    name: string;
	images: [string];
    folder: [string];
    sharing: boolean;
    child: boolean;
    father: string;
    created_at: Date;
}