/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const ImageSchema = new mongoose.Schema({
    name: String,
    image: String,
    galery: [String],
    brand: String,
    type: String,
    reference: String,
    description: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
})