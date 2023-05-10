/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const KeySchema = new mongoose.Schema({
    album: String,
    value: String,
    expirationDate: Date,
    created_at: {
        type: Date,
        default: Date.now,
    },
})