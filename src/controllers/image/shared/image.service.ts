/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './image';
@Injectable()
export class ImageService {

    constructor(
        @InjectModel('Image') private readonly imageModel: Model<Image>,
    ) { }

    async list() {
        return await this.imageModel.find().exec();
    }

    async getById(id: string) {
        return await this.imageModel.findById(id).exec();
    }

    async create(img: Image) {
        const created = new this.imageModel(img);
        return await created.save();
    }

    async update(id: string, img: Image) {
        await this.imageModel.updateOne({ _id: id }, img).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.imageModel.deleteOne({ _id: id }).exec();
    }
}