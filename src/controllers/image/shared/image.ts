/* eslint-disable prettier/prettier */
import { Document } from "mongoose";

export class Image extends Document {
    name: string;
	course: string;
	class: string;
	image: string;
	album: string;
	invitation: boolean;
    picture: boolean;
    created_at: Date;
}