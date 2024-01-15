/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder } from './folder';
import { forkJoin } from 'rxjs';
import { RenameFolderDto } from '../dto/folder.dto';
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

    async getForKey(id: string) {
        const folder = await this.getById(id);

        if (!folder || !folder.images) {
            return folder;
        }

        folder.images.sort((a, b) => {
            const regex = /\((\d+)\)/;
            const numA = a.match(regex) ? parseInt(a.match(regex)[1]) : 0;
            const numB = b.match(regex) ? parseInt(b.match(regex)[1]) : 0;

            return numA - numB;
        });

        return folder;
    }

    async getByIdLength(id: string): Promise<any> {
        const pasta = await this.folderModel.findById(id).exec();
        return pasta.images.length;
    }

    async getFolders(id: string) {
        const pasta = await this.folderModel.findById(id);
        const len: number = pasta.folder.length;

        if (len === 0) {
            pasta.images.sort((a, b) => {
                const matchA = a.match(/\((\d+)\)/);
                const matchB = b.match(/\((\d+)\)/);

                if (matchA && matchB) {
                    const numA = parseInt(matchA[1]);
                    const numB = parseInt(matchB[1]);
                    return numA - numB;
                } else if (matchA) {
                    return -1;
                } else if (matchB) {
                    return 1;
                }
                return 0;
            });

            return await pasta;
        } else {
            pasta.images.sort((a, b) => {
                const matchA = a.match(/\((\d+)\)/);
                const matchB = b.match(/\((\d+)\)/);

                if (matchA && matchB) {
                    const numA = parseInt(matchA[1]);
                    const numB = parseInt(matchB[1]);
                    return numA - numB;
                } else if (matchA) {
                    return -1;
                } else if (matchB) {
                    return 1;
                }
                return 0;
            });

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

    async getVideos(id: string) {
        const pasta = await this.folderModel.findById(id);
        const len: number = pasta.folder.length;

        if (len === 0) {
            // Separar vídeos de imagens usando a função isVideo
            const videos: string[] = pasta.images.filter(item => this.isVideo(item));
            const imagens: string[] = pasta.images.filter(item => !this.isVideo(item));

            // Ordenar imagens com base nos números dentro dos parênteses
            imagens.sort((a, b) => {
                const matchA = a.match(/\((\d+)\)/);
                const matchB = b.match(/\((\d+)\)/);

                if (matchA && matchB) {
                    const numA = parseInt(matchA[1]);
                    const numB = parseInt(matchB[1]);
                    return numA - numB;
                } else if (matchA) {
                    return -1;
                } else if (matchB) {
                    return 1;
                }
                return 0;
            });

            const result = {
                _id: pasta._id,
                name: pasta.name,
                imagens: imagens,
                videos: videos,
                folder: pasta.folder,
                sharing: pasta.sharing,
                child: pasta.child,
                father: pasta.father,
                invitation: pasta.invitation,
                picture: pasta.picture,
                photobook: pasta.photobook,
                LEDpanel: pasta.LEDpanel,
                created_at: pasta.created_at
            };
            return result;
        } else {
            //Pega as pastas
            const observables = pasta.folder.map(id => this.getById(id));
            const folders = await forkJoin(observables).toPromise();

            // Separar vídeos de imagens usando a função isVideo
            const videos: string[] = pasta.images.filter(item => this.isVideo(item));
            const imagens: string[] = pasta.images.filter(item => !this.isVideo(item));

            // Ordenar imagens com base nos números dentro dos parênteses
            imagens.sort((a, b) => {
                const matchA = a.match(/\((\d+)\)/);
                const matchB = b.match(/\((\d+)\)/);

                if (matchA && matchB) {
                    const numA = parseInt(matchA[1]);
                    const numB = parseInt(matchB[1]);
                    return numA - numB;
                } else if (matchA) {
                    return -1;
                } else if (matchB) {
                    return 1;
                }
                return 0;
            });

            const result = {
                _id: pasta._id,
                name: pasta.name,
                imagens: imagens,
                videos: videos,
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
            };
            return result;
        }
    }

    isVideo(media: string): boolean {
        return media.includes('video');
    }

    async getByName(name: string) {
        const pasta = await this.folderModel.findOne({ name }).exec();
        const len: number = pasta.folder.length;

        if (len === 0) {
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

    async rename(id: string, body: RenameFolderDto): Promise<Folder> {
        const updatedFolder = await this.folderModel
            .findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
            .exec();

        if (!updatedFolder) {
            throw new NotFoundException(`Folder with ID ${id} not found`);
        }

        return updatedFolder;
    }

    async updateImages(id: string, newImage: string) {
        const updatedFolder = await this.folderModel.findByIdAndUpdate(
            id,
            { $push: { images: newImage } },
            { new: true }
        );

        if (!updatedFolder) {
            throw new Error('Folder not found');
        }

        return updatedFolder;
    }

    async delete(id: string): Promise<void> {
        const folderToDelete = await this.getById(id);

        if (folderToDelete.folder && folderToDelete.folder.length > 0) {
            for (const subfolderId of folderToDelete.folder) {
                await this.delete(subfolderId);
            }
        }

        await this.folderModel.deleteOne({ _id: id }).exec();
    }

}