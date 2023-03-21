/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
    is_admin: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})