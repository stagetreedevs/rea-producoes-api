/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { Image } from './image';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
// import { Brand } from 'src/controllers/brand/shared/brand';
// import { Type } from 'src/controllers/type/shared/type';
@Injectable()
export class ImageService {

    constructor(
        @InjectModel('Image') private readonly imgModel: Model<Image>,
        // @InjectModel('Brand') private readonly brandModel: Model<Brand>,
        // @InjectModel('Type') private readonly typeModel: Model<Type>,
    ) { }

    async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
        const findQuery = this.imgModel
            .find()
            .sort({ "created_at": -1 })
            .skip(documentsToSkip);

        if (limitOfDocuments) {
            findQuery.limit(limitOfDocuments);
        }
        const results = await findQuery;
        const count = await this.imgModel.count();
        return { results, count };
    }

    async searchPages(brand: string, type: string, ref: string, name: string, documentsToSkip = 0, limitOfDocuments?: number) {
        if(!brand) brand = '';
        if(!type) type = '';
        if(!ref) ref = '';
        if(!name) name = '';

        //CASE INSESITIVE
        const nameWord = name.split(" ")
        let regexName = ""
        nameWord.map((word) => { regexName += `(?=.*${word})` })

        const geral = this.imgModel.find({
            "brand": {$regex : `${brand}`},
            "type": {$regex : `${type}`},
            "reference": {$regex : `${ref}`, $options: "i"},
            "name": {$regex: regexName, $options: "i"}
        });

        const findQuery = this.imgModel
            .find({
                "brand": {$regex : `${brand}`},
                "type": {$regex : `${type}`},
                "reference": {$regex : `${ref}`, $options: "i"},
                "name": {$regex: regexName, $options: "i"}
            })
            .collation( { locale: 'en', strength: 2 } )
            .sort({ "created_at": -1 })
            .skip(documentsToSkip);

        if (limitOfDocuments) {
            findQuery.limit(limitOfDocuments);
        }

        const results = await findQuery;
        const count = await (await geral).length;
        return { results, count };
    }

    async list() {
        return await this.imgModel.find().exec();
    }

    async getById(id: string) {
        return await this.imgModel.findById(id).exec();
    }

    async findOne(email: string): Promise<Image | undefined> {
        return this.imgModel.findOne({ email: email })
    }

    async create(imb: Image, brand_id: string, type_id: string) {

        // const brand = await this.brandModel.findById(brand_id).exec();
        // const type = await this.typeModel.findById(type_id).exec();

        const created = new this.imgModel(imb);
        const image_id = created._id.toString();

        // brand.images.push(image_id);
        // type.images.push(image_id);
        // await this.brandModel.updateOne({ _id: brand_id }, brand).exec()
        // await this.typeModel.updateOne({ _id: type_id }, type).exec()

        return await created.save();
    }

    async update(id: string, imb: Image) {
        await this.imgModel.updateOne({ _id: id }, imb).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.imgModel.deleteOne({ _id: id }).exec();
    }

    async upload(file) {
        const { originalname } = file;
        const bucketS3 = 'imagepainmanagement';
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
    
    async downloadS3FolderAsZip(folder: string, files: string[]) {
        const s3 = this.getS3();
        const bucket = 'imagepainmanagement';
        const params = {
            Bucket: bucket,
            Prefix: folder,
        };

        const filesDownload: any[] = [];
        for (let i = 0; i < files.length; i++) {
            const result = await s3.getObject({ Bucket: bucket, Key: files[i] }).promise();
            const b64 = Buffer.from(result.Body.toString('base64'));
            const mimeType = 'image/png';
            const send = (`data:${mimeType};base64,${b64}`);
            filesDownload.push(send);
        }
        return await filesDownload;
    };
}