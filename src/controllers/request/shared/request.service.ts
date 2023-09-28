/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async verifyEmail(email: string) {
        const found = await this.reqModel.findOne({ email: email });
        if (found) {
            throw new HttpException('Este email já foi utilizado', HttpStatus.BAD_REQUEST);
        } else {
            return 'Email está disponível';
        }
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

    async upload(email: any, file: Express.Multer.File) {
        const storage = getStorage();
        const { originalname } = file;
        const { mimetype } = file;
        const type = mimetype.split('/').join('.');
        const metadata = {
            contentType: `${type}`,
        };
        const fileRef = ref(storage, `músicas/${email.email}/${originalname}`);
        const uploaded = await uploadBytes(fileRef, file.buffer, metadata);

        const link = {
            url: ""
        }
        link.url = await getDownloadURL(uploaded.ref).then((url) => { return url });
        return link;
    }
    async uploadAll(email: any, files: Express.Multer.File[]) {
        const storage = getStorage();
        const links = [];

        for (const file of files) {
            const { originalname } = file;
            const { mimetype } = file;
            const type = mimetype.split('/').join('.');
            const metadata = {
                contentType: `${type}`,
            };
            const fileRef = ref(storage, `requests/${email.email}/${originalname}`);
            const uploaded = await uploadBytes(fileRef, file.buffer, metadata);
            const url = await getDownloadURL(uploaded.ref);

            links.push(url);
        }

        return links;
    }

}