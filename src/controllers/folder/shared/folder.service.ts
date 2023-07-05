/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder } from './folder';
import { forkJoin } from 'rxjs';
@Injectable()
export class FolderService {

    constructor(
        @InjectModel('Folder') private folderModel: Model<Folder>
    ) { }

    async list() {
        return await this.folderModel.find().exec();
    }

    async getById(id: string) {
        return await this.folderModel.findById(id).exec();
    }

    async getFolders(id: string) {
        const pasta = await this.folderModel.findById(id);
        const len:number = pasta.folder.length;

        if(len === 0){
            return await this.folderModel.findById(id);
        }
        else{
            const observables = pasta.folder.map(id => this.getById(id));
            const folders = await forkJoin(observables).toPromise();
            const result = {
                _id: pasta._id,
                name: pasta.name,
                images: pasta.images,
                folder: pasta.folder,
                folders: folders,
                sharing: pasta.sharing,
                child: pasta.child,
                father: pasta.father,
                invitation: pasta.invitation,
                picture: pasta.picture,
                photobook: pasta.photobook,
                LEDpanel: pasta.LEDpanel,
                created_at: pasta.created_at
            }
            return result;
        }

    }

    async getByName(name: string) {
        const pasta = await this.folderModel.findOne({ name }).exec();
        const len:number = pasta.folder.length;

        if(len === 0){
            return await this.folderModel.findOne({ name }).exec();
        }
        else {
            const observables = pasta.folder.map(id => this.getById(id));
            const folders = await forkJoin(observables).toPromise();
            const result = {
                _id: pasta._id,
                name: pasta.name,
                images: pasta.images,
                folder: pasta.folder,
                folders: folders,
                sharing: pasta.sharing,
                child: pasta.child,
                created_at: pasta.created_at
            }
            return result;
        }
    }

    async create(folder: Folder) {
        const created = new this.folderModel(folder);
        return await created.save();
    }

    async update(id: string, folder: Folder) {
        await this.folderModel.updateOne({ _id: id }, folder).exec()
        return this.getById(id);
    }

    async delete(id: string) {
        return await this.folderModel.deleteOne({ _id: id }).exec();
    }

}