/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './album';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FolderService } from 'src/controllers/folder/shared/folder.service';
import { forkJoin } from 'rxjs';
@Injectable()
export class AlbumService {

    constructor(
        @InjectModel('Album') private readonly albumModel: Model<Album>,
        private folderService: FolderService
    ) { }

    async list() {
        return await this.albumModel.find().exec();
    }

    async findOne(email: string): Promise<Album | undefined> {
        return this.albumModel.findOne({ email: email })
    }

    async getId(id: string) {
        return await this.albumModel.findById(id).exec();
    }

    async getById(id: string) {
        const album = await this.albumModel.findById(id).exec();
        const len:number = album.galery.length;

        if(len === 0){
            return await this.albumModel.findById(id).exec();
        }
        else{
            const observables = album.galery.map(id => this.folderService.getById(id));
            const galery = await forkJoin(observables).toPromise();
            const filteredFolders = (await galery).filter(folder => folder.child === false);
            const result = {
                album_id: album._id,
                album_name: album.name,
                galery: album.galery,
                created_at: album.created_at,
                folders: filteredFolders
            }
            return result;
        }
    }

    async create(album: Album) {
        const created = new this.albumModel(album);
        return await created.save();
    }

    async update(id: string, album: Album) {
        await this.albumModel.updateOne({ _id: id }, album).exec()
        return this.getId(id);
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

        const link = {
            url: ""
        }
        link.url = await getDownloadURL(uploaded.ref).then((url) => { return url });
        return link;
    }
}