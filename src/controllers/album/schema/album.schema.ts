/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const AlbumSchema = new mongoose.Schema({
    name: String,
    cover: String,
    galery: [String],
    limit: {
        type: Number,
        default: 5
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})