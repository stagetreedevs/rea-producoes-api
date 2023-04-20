/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const KeySchema = new mongoose.Schema({
    album: String,
    value: String,
    expirationDate: {
        type: Date,
        default: function () {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 180);
            return expirationDate;
        }
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})