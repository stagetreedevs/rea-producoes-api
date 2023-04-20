/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const FolderSchema = new mongoose.Schema({
    name: String,
	images: [String],
    created_at: {
        type: Date,
        default: Date.now,
    },
})