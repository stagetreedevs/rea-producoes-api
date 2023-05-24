/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const FolderSchema = new mongoose.Schema({
    name: String,
	images: [String],
	folder: [String],
    sharing: {
        type: Boolean,
        default: false
    },
    child: {
        type: Boolean,
        default: false
    },
    father: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
})