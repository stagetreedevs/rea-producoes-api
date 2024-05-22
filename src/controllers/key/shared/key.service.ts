/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Key } from './key';
import { Album } from 'src/controllers/album/shared/album';
import { FolderService } from 'src/controllers/folder/shared/folder.service';
import { forkJoin } from 'rxjs';
import { Request } from 'src/controllers/request/shared/request';
import { Invitation } from 'src/controllers/invitation/shared/invitation';
import { ImagesUser } from 'src/controllers/imagesUser/shared/imagesUser';
@Injectable()
export class KeyService {

    constructor(
        @InjectModel('Key') private readonly keyModel: Model<Key>,
        @InjectModel('Album') private readonly albumModel: Model<Album>,
        @InjectModel('Request') private readonly reqModel: Model<Request>,
        @InjectModel('Invitation') private readonly invModel: Model<Invitation>,
        @InjectModel('ImagesUser') private readonly imgModel: Model<ImagesUser>,
        private folderService: FolderService,
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

    async getByCodeClass(key: string) {
        const chave = await this.keyModel.findOne({ value: key }).exec();
        if (!chave) {
            return;
        }

        const album = await this.albumModel.findById(chave.album).exec();
        if (!album) {
            return;
        }

        return album.name;
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
            filteredFolders.sort((a, b) => a.name.localeCompare(b.name));
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
            const observables = album.galery.map(id => this.folderService.getForKey(id));
            const galery = await forkJoin(observables).toPromise();
            const result = {
                album_id: album._id,
                album_name: album.name,
                folders: galery
            }
            return result;
        }
    }

    async getAlbumByKey(value: string) {
        const chave = await this.keyModel.findOne({ value: value }).exec();
        const album = await this.albumModel.findById(chave.album, 'name cover limit created_at').exec();
        return album;
    }

    async create(key: Key) {
        const created = new this.keyModel(key);
        return await created.save();
    }

    async update(id: string, key: Key) {
        const originKey: any = await this.getById(id);

        if (originKey.value !== key.value) {
            await this.updateAllImages(originKey.value, key.value);
            await this.updateAllRequests(originKey.value, key.value);
            await this.updateAllInvitation(originKey.value, key.value);
        }

        // ATUALIZA DE FATO
        await this.keyModel.updateOne({ _id: id }, key).exec()
        return this.getById(id);
    }

    async updateAllInvitation(old_key: string, new_key: string): Promise<void> {
        await this.invModel.updateMany({ class_key: old_key }, { $set: { class_key: new_key } }).exec();
    }

    async updateAllRequests(old_key: string, new_key: string): Promise<void> {
        await this.reqModel.updateMany({ class_key: old_key }, { $set: { class_key: new_key } }).exec();
    }

    async updateAllImages(old_key: string, new_key: string): Promise<void> {
        await this.imgModel.updateMany({ class_key: old_key }, { $set: { class_key: new_key } }).exec();
    }

    async delete(id: string) {
        return await this.keyModel.deleteOne({ _id: id }).exec();
    }

    async deleteByAlbum(id: string) {
        return await this.keyModel.deleteOne({ album: id }).exec();
    }

}