/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Key } from './key';
@Injectable()
export class KeyService {

    constructor(
        @InjectModel('Key') private readonly keyModel: Model<Key>,
    ) { }

    async list() {
        return await this.keyModel.find().exec();
    }

    async getById(id: string) {
        return await this.keyModel.findById(id).exec();
    }

    async create(key: Key) {
        const created = new this.keyModel(key);
        return await created.save();
    }

    async update(id: string, key: Key) {
        await this.keyModel.updateOne({ _id: id }, key).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.keyModel.deleteOne({ _id: id }).exec();
    }

}