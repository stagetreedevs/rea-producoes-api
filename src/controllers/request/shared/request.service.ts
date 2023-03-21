/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './request';
import { S3 } from 'aws-sdk';

@Injectable()
export class RequestService {

    constructor(
        @InjectModel('Request') private readonly reqModel: Model<Request>,
    ) { }

    async list() {
        return await this.reqModel.find().exec();
    }

    async findOne(email: string): Promise<Request | undefined> {
        return this.reqModel.findOne({ email: email })
    }

    async getById(id: string) {
        return await this.reqModel.findById(id).exec();
    }

    async create(req: Request) {
        const created = new this.reqModel(req);
        return await created.save();
    }

    async update(id: string, req: Request) {
        await this.reqModel.updateOne({ _id: id }, req).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.reqModel.deleteOne({ _id: id }).exec();
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