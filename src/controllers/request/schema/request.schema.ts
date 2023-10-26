/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const RequestSchema = new mongoose.Schema({
    name: String,
    email: String,
    class_key: String,
	course: String,
	class: String,
	linkMusic: String,
    images: [String],
    created_at: {
        type: Date,
        default: Date.now,
    },
})