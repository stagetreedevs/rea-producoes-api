/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ImageUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    class_key: String,
	course: String,
	class: String,
	image: String,
	album: String,
	ledPanel: [String],
	picture: [String],
	albuns: [String],
    created_at: {
        type: Date,
        default: Date.now,
    },
})