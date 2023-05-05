/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema({
    name: String,
    email: String,
	course: String,
	class: String,
	image: String,
	album: String,
    invitation: {
        type: Boolean,
        default: false,
    },
    picture: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})