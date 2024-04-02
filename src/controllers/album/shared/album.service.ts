/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './album';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FolderService } from 'src/controllers/folder/shared/folder.service';
import { KeyService } from 'src/controllers/key/shared/key.service';
import { forkJoin } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AlbumService {

    constructor(
        @InjectModel('Album') private readonly albumModel: Model<Album>,
        private folderService: FolderService,
        private keyService: KeyService
    ) { }

    async list() {
        return await this.albumModel.find().sort({ name: 1 }).exec();
    }

    async findOne(email: string): Promise<Album | undefined> {
        return this.albumModel.findOne({ email: email })
    }

    async getId(id: string) {
        return await this.albumModel.findById(id).exec();
    }

    async getById(id: string) {
        const album = await this.albumModel.findById(id).exec();
        const len: number = album.galery.length;

        if (len === 0) {
            return await this.albumModel.findById(id).exec();
        }
        else {
            const observables = album.galery.map(id => this.folderService.getById(id));
            const galery = await forkJoin(observables).toPromise();
            const filteredFolders = (await galery).filter(folder => folder.child === false);

            filteredFolders.sort((a, b) => a.name.localeCompare(b.name));

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

    async updateLimit(id: string, newLimit: number): Promise<any> {
        const updatedAlbum = await this.albumModel.findByIdAndUpdate(
            id,
            { $set: { limit: newLimit } },
            { new: true }
        ).exec();

        if (!updatedAlbum) {
            throw new NotFoundException(`Album ${id} nao encontrado`);
        }

        return await this.getById(id);
    }

    async delete(id: string): Promise<void> {
        const albumToDelete = await this.getId(id);

        if (albumToDelete) {
            await this.keyService.deleteByAlbum(id);

            if (albumToDelete.galery && albumToDelete.galery.length > 0) {
                const errors: Error[] = [];

                for (const subfolderId of albumToDelete.galery) {
                    try {
                        await this.folderService.delete(subfolderId);
                    } catch (error) {
                        errors.push(error);
                    }
                }

                if (errors.length > 0) {
                    throw new Error(`Erro ao excluir subpastas: ${errors.map(err => err.message).join(', ')}`);
                }
            }
            await this.albumModel.deleteOne({ _id: id }).exec();
        } else {
            console.log('Álbum não encontrado ou já foi excluído.');
        }
    }

    generateUUID(): string {
        return uuidv4();
    }

    getCurrentDateWithMinutes(): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

        return formattedDate;
    }

    extrairConteudoEntreParenteses(originalname: string): string {
        const regex = /\((\d+)\)/;
        const match = originalname.match(regex);

        return match ? match[0] : null;
    }

    async upload(path: any, file: Express.Multer.File) {
        const storage = getStorage();
        const { originalname } = file;
        const parentheses = this.extrairConteudoEntreParenteses(originalname);
        const { mimetype } = file;
        const type = mimetype.split('/')[1];
        const metadata = {
            contentType: `${mimetype}`,
        };

        const name = `${this.getCurrentDateWithMinutes()}${this.generateUUID()}${parentheses}.${type}`
        const fileRef = ref(storage, `${path.path}/${name}`);
        const uploaded = await uploadBytes(fileRef, file.buffer, metadata);

        const link = {
            url: ""
        }
        link.url = await getDownloadURL(uploaded.ref).then((url) => { return url });
        return link;
    }

    async uploadMp3(path: any, file: Express.Multer.File) {
        const storage = getStorage();
        const { originalname } = file;
        const { mimetype } = file;
        const metadata = {
            contentType: `${mimetype}`,
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