/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user';
import { S3 } from 'aws-sdk';

@Injectable()
export class UserService {

    constructor (
        @InjectModel('User') private readonly userModel: Model<User>,
        ) {}
    
    async list(){
        return await this.userModel.find().exec();
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({email: email})   
    }


    async getById(id: string){
        return await this.userModel.findById(id).exec();
    }

    async create(user: User){
        const created = new this.userModel(user);
        return await created.save();
    }

    async update(id: string, user: User){
        await this.userModel.updateOne({ _id: id}, user).exec()
        return this.getById(id);
    }

    async delete(id: string){
        return await this.userModel.deleteOne({ _id: id}).exec();
    }

    async upload(file) {
        const { originalname } = file;
        const bucketS3 = 'imagepainmanagement/users';
        return await this.uploadS3(file.buffer, bucketS3, originalname);
    }

    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        return await new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
            if (err) {
                Logger.error(err);
                reject(err.message);
            }
                resolve(data);
            });
        });
    }

    getS3() {
        return new S3({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });
    }
}