/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class ImagesUser extends Document {
    name: string;
    email: string;
	course: string;
	class: string;
	album: string;
	ledPanel: [string];
    picture: [string];
    created_at: Date;
}