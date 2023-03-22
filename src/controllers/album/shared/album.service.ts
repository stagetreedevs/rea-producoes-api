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

    async upload(file: Express.Multer.File) {
        const storage = getStorage();
        const bucket = 'reaproducoes-31713.appspot.com';
        const { originalname } = file;

        // const fileRef = ref(storage, `${path}/${originalname}`);
        const fileRef = ref(storage, `test/${originalname}`);

        const uploaded = await uploadBytes(fileRef, file.buffer);

        const link = getDownloadURL(uploaded.ref).then((url) => { return url })
        return await link;
    }
}