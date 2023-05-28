/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImagesUser } from './imagesUser';
@Injectable()
export class ImagesUserService {

    constructor(
        @InjectModel('ImagesUser') private readonly imageModel: Model<ImagesUser>,
    ) { }

    async list() {
        return await this.imageModel.find().exec();
    }

    async getById(id: string) {
        return await this.imageModel.findById(id).exec();
    }

    async create(img: ImagesUser) {
        const created = new this.imageModel(img);
        return await created.save();
    }

    async update(id: string, img: ImagesUser) {
        await this.imageModel.updateOne({ _id: id }, img).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.imageModel.deleteOne({ _id: id }).exec();
    }
}