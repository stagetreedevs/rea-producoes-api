/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './album';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Injectable()
export class AlbumService {

    constructor(
        @InjectModel('Album') private readonly albumModel: Model<Album>
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
        const created = new this.albumModel(album);
        return await created.save();
    }

    async update(id: string, album: Album) {
        await this.albumModel.updateOne({ _id: id }, album).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.albumModel.deleteOne({ _id: id }).exec();
    }

    async upload(path: any, file: Express.Multer.File) {
        const storage = getStorage();
        const { originalname } = file;
        const { mimetype } = file;
        const type = mimetype.split('/').join('.');
        const metadata = {
            contentType: `${type}`,
        };
        const fileRef = ref(storage, `${path.path}/${originalname}`);
        const uploaded = await uploadBytes(fileRef, file.buffer, metadata);
        const link = getDownloadURL(uploaded.ref).then((url) => { return url })
        return await link;
    }
}