/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './album';
import { S3 } from 'aws-sdk';

@Injectable()
export class AlbumService {

    constructor(
        @InjectModel('Album') private readonly albumModel: Model<Album>,
    ) { }

    async list() {
        return await this.albumModel.find().exec();
    }

    async findOne(email: string): Promise<Album | undefined> {
        return this.albumModel.findOne({ email: email })
    }


    async getById(id: string) {
        return await this.albumModel.findById(id).exec();
    }

    async create(album: Album) {
        const created = new this.albumModel(Album);
        return await created.save();
    }

    async update(id: string, album: Album) {
        await this.albumModel.updateOne({ _id: id }, album).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.albumModel.deleteOne({ _id: id }).exec();
    }

    // async upload(file) {
    //     const { originalname } = file;
    //     const bucketS3 = 'imagepainmanagement/users';
    //     return await this.uploadS3(file.buffer, bucketS3, originalname);
    // }

    // async uploadS3(file, bucket, name) {
    //     const s3 = this.getS3();
    //     const params = {
    //         Bucket: bucket,
    //         Key: String(name),
    //         Body: file,
    //     };
    //     return await new Promise((resolve, reject) => {
    //         s3.upload(params, (err, data) => {
    //         if (err) {
    //             Logger.error(err);
    //             reject(err.message);
    //         }
    //             resolve(data);
    //         });
    //     });
    // }

    // getS3() {
    //     return new S3({
    //         accessKeyId: process.env.ACCESS_KEY_ID,
    //         secretAccessKey: process.env.SECRET_ACCESS_KEY,
    //     });
    // }
}