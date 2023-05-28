/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './request';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

    async upload(path: any, file: Express.Multer.File) {
        const storage = getStorage();
        const { originalname } = file;
        const { mimetype } = file;
        const type = mimetype.split('/').join('.');
        const metadata = {
            contentType: `${type}`,
        };
        const fileRef = ref(storage, `músicas/${path.path}/${originalname}`);
        const uploaded = await uploadBytes(fileRef, file.buffer, metadata);

        const link = {
            url: ""
        }
        link.url = await getDownloadURL(uploaded.ref).then((url) => { return url });
        return link;
    }
}