/* eslint-disable prettier/prettier */
import { Document } from "mongoose";
export class Image extends Document {
    name: string;
    image: string;
    galery: [string];
    brand: string;
    type: string;
    reference: string;
    description: string;
    created_at: Date;
}