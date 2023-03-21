/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    album: [String],
    is_user: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})