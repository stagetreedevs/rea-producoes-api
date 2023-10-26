/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class ImagesUser extends Document {
    name: string;
    email: string;
    class_key: string;
	course: string;
	class: string;
	album: string;
	ledPanel: [string];
    picture: [string];
    albuns: [string];
    created_at: Date;
}