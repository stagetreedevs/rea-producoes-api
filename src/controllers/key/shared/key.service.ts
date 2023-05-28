/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Key } from './key';
import { Album } from 'src/controllers/album/shared/album';
import { FolderService } from 'src/controllers/folder/shared/folder.service';
import { forkJoin } from 'rxjs';
@Injectable()
export class KeyService {

    constructor(
        @InjectModel('Key') private readonly keyModel: Model<Key>,
        @InjectModel('Album') private readonly albumModel: Model<Album>,
        private folderService: FolderService
    ) { }

    async list() {
        return await this.keyModel.find().exec();
    }

    async getById(id: string) {
        return await this.keyModel.findById(id).exec();
    }

    async getByAlbum(album: string) {
        return await this.keyModel.findOne({ album: album }).exec();
    }

    async getByValue(value: string) {
        return await this.keyModel.findOne({ value: value }).exec();
    }

    async getAlbumValue(value: string) {
        const chave = await this.keyModel.findOne({ value }).exec();
        const album = await this.albumModel.findById(chave.album).exec();

        const len: number = album.galery.length;

        if (len === 0) {
            return await this.albumModel.findById(album?._id).exec();
        } else {
            const observables = album.galery.map((id) => this.folderService.getById(id));
            const galery = await forkJoin(observables).toPromise();
            const filteredFolders = (await galery).filter((folder) => folder.child === false);
            const result = {
                _id: album._id,
                name: album.name,
                galery: album.galery,
                created_at: album.created_at,
                folders: filteredFolders,
            };
            return result;
        }
    }

    async getFolders(value: string) {
        const chave = await this.keyModel.findOne({ value: value }).exec();
        const album = await this.albumModel.findById(chave.album).exec();
        const len: number = album.galery.length;

        if (len === 0) {
            return await this.albumModel.findById(chave.album).exec();
        }
        else {
            const observables = album.galery.map(id => this.folderService.getById(id));
            const galery = await forkJoin(observables).toPromise();
            const result = {
                album_id: album._id,
                album_name: album.name,
                folders: galery
            }
            return result;
        }

    }

    async create(key: Key) {
        const created = new this.keyModel(key);
        return await created.save();
    }

    async update(id: string, key: Key) {
        await this.keyModel.updateOne({ _id: id }, key).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.keyModel.deleteOne({ _id: id }).exec();
    }

}