/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Invitation extends Document {
    name: string;
    email: string;
	class_key: string;
	course: string;
	class: string;
	image: string;
	album: string;
    created_at: Date;
}