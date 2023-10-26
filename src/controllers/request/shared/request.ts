/* eslint-disable prettier/prettier */
import { Document } from "mongoose";
export class Request extends Document {
    name: string;
    email: string;
    class_key: string;
	course: string;
	class: string;
	linkMusic: string;
	images: [string];
    created_at: Date;
}