/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Request extends Document {
    name: string;
	course: string;
	class: string;
	linkMusic: string;
	fileMusic: string;
    created_at: Date;
}