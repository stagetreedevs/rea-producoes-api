/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const RequestSchema = new mongoose.Schema({
    name: String,
	course: String,
	class: String,
	linkMusic: String,
	fileMusic: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
})