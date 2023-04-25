/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Key } from './key';
import { Album } from 'src/controllers/album/shared/album';
@Injectable()
export class KeyService {

    constructor(
        @InjectModel('Key') private readonly keyModel: Model<Key>,
        @InjectModel('Album') private readonly albumModel: Model<Album>
    ) { }

    async list() {
        return await this.keyModel.find().exec();
    }

    async getById(id: string) {
        return await this.keyModel.findById(id).exec();
    }

    async getKeyValue(value: string) {
        const chave = await this.keyModel.findOne({value: value}).exec();
        return await this.albumModel.findById(chave.album).exec();
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