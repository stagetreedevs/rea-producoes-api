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
import { Response } from 'express';
import * as archiver from 'archiver';
import axios from 'axios';
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
            console.warn('Álbum não encontrado ou já foi excluído.');
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

    async downloadAlbumAsZip(albumId: string, res: Response): Promise<void> {
        const album = await this.albumModel.findById(albumId).select('name galery').lean();

        if (!album) {
            throw new NotFoundException('Álbum não encontrado');
        }

        const zipFilename = `${album.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;

        // Configura headers
        res.setHeader('Content-Disposition', `attachment; filename=${zipFilename}`);
        res.setHeader('Content-Type', 'application/zip');

        // Configuração EXTREMAMENTE otimizada para baixa memória
        const archive = archiver('zip', {
            zlib: { level: 0 }, // Compressão ZERO para economizar CPU
            highWaterMark: 64 * 1024, // Buffer de apenas 64KB
            store: true // Apenas armazenar, sem compressão
        });

        // Monitoramento rigoroso de recursos
        const startTime = Date.now();
        let processedFiles = 0;
        let totalSize = 0;

        const resourceMonitor = setInterval(() => {
            const memoryUsage = process.memoryUsage();
            const uptime = Date.now() - startTime;

            // Alerta crítico de memória
            if (memoryUsage.heapUsed > 800 * 1024 * 1024) { // 800MB
                console.warn('ALERTA: Memória crítica, forçando GC');
                if (global.gc) {
                    global.gc();
                }
            }
        }, 10000);

        try {
            // Pipe do archive para response
            archive.pipe(res);

            // Event handlers para debug
            archive.on('warning', (err) => {
                console.warn('Archive warning:', err);
            });

            archive.on('error', (err) => {
                console.error('Archive error:', err);
                throw err;
            });

            // Busca pastas de forma PAGINADA para evitar sobrecarga de memória
            const folderIds = album.galery || [];

            // Processa no máximo 3 pastas por vez
            const BATCH_SIZE = 3;

            for (let i = 0; i < folderIds.length; i += BATCH_SIZE) {
                const batch = folderIds.slice(i, i + BATCH_SIZE);

                await this.processFolderBatch(batch, archive, (count, size) => {
                    processedFiles += count;
                    totalSize += size;
                });

                // Pausa estratégica entre batches
                await new Promise(resolve => setTimeout(resolve, 500));

                // Força GC a cada 5 batches se disponível
                if (global.gc && i > 0 && i % (BATCH_SIZE * 5) === 0) {
                    global.gc();
                }

                // Verifica se o cliente ainda está conectado
                // substitui res.closed (não existe em Express Response) por res.finished
                // e usa res.socket?.destroyed para cobrir o caso do socket ter sido destruído
                if (res.finished || res.socket?.destroyed) {
                    break;
                }
            }

            await archive.finalize();

        } catch (error) {
            console.error('Erro crítico ao gerar ZIP:', error);
            clearInterval(resourceMonitor);

            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Falha ao gerar arquivo ZIP',
                    message: error.message
                });
            }

            // Destrói o archive em caso de erro
            if (archive) {
                archive.destroy();
            }
        } finally {
            clearInterval(resourceMonitor);
        }
    }

    private async processFoldersForZip(folders: any[], archive: archiver.Archiver): Promise<void> {
        const limitConcurrentRequests = async (tasks: (() => Promise<void>)[], limit: number) => {
            const results = [];
            const executing = new Set<Promise<void>>();

            for (const task of tasks) {
                const p = task().finally(() => executing.delete(p));
                executing.add(p);
                results.push(p);

                if (executing.size >= limit) {
                    await Promise.race(executing);
                }
            }

            return Promise.all(results);
        };

        // Cria tarefas para todas as imagens de todas as pastas
        const allImageTasks: (() => Promise<void>)[] = [];

        folders.forEach(folder => {
            const folderName = folder.name.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s]/gi, '_');

            folder.images.forEach((url: string, index: number) => {
                const task = async () => {
                    try {
                        const response = await axios.get(url, {
                            responseType: 'arraybuffer',
                            timeout: 30000
                        });

                        const imageBuffer = Buffer.from(response.data, 'binary');
                        const extension = this.getFileExtension(url);
                        const imageName = `${folderName}/imagem_${index + 1}.${extension}`;

                        archive.append(imageBuffer, { name: imageName });
                    } catch (error) {
                        console.error(`Erro ao baixar imagem ${url}:`, error.message);
                    }
                };

                allImageTasks.push(task);
            });
        });

        // Executa com limite de concorrência
        const maxConcurrentRequests = 5; // Reduzido para evitar sobrecarga
        await limitConcurrentRequests(allImageTasks, maxConcurrentRequests);
    }

    private getFileExtension(url: string): string {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const parts = pathname.split('.');
            if (parts.length > 1) {
                return parts.pop()?.toLowerCase() || 'jpg';
            }
        } catch {
            // Fallback para parsing simples
            const urlWithoutParams = url.split('?')[0];
            const parts = urlWithoutParams.split('.');
            return parts.length > 1 ? parts.pop()?.toLowerCase() || 'jpg' : 'jpg';
        }
        return 'jpg';
    }

    private async addImageToArchive(
        url: string,
        folderName: string,
        index: number,
        archive: archiver.Archiver
    ): Promise<{ size: number }> {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream',
                timeout: 30000,
                maxContentLength: 100 * 1024 * 1024, // 100MB max por arquivo
                decompress: false // Não descomprimir automaticamente
            });

            const extension = this.getFileExtension(url);
            const filename = `imagem_${index}.${extension}`;
            const fullPath = `${folderName}/${filename}`;

            return new Promise((resolve, reject) => {
                let size = 0;

                response.data.on('data', (chunk: Buffer) => {
                    size += chunk.length;
                });

                response.data.on('end', () => {
                    resolve({ size });
                });

                response.data.on('error', reject);

                // Adiciona o stream diretamente ao archive
                archive.append(response.data, { name: fullPath });
            });

        } catch (error) {
            console.error(`Falha no download da imagem ${index} da pasta ${folderName}:`, error.message);
            return { size: 0 };
        }


    }

    private async processFolderBatch(folderIds: string[], archive: archiver.Archiver, progress: (count: number, size: number) => void): Promise<void> {
        const folders = [];

        // Busca informações básicas das pastas
        for (const folderId of folderIds) {
            try {
                const folder = await this.folderService.getFolderForDownload(folderId);
                if (folder && folder.images && folder.images.length > 0) {
                    folders.push(folder);
                }
            } catch (error) {
                console.error(`Erro ao buscar pasta ${folderId}:`, error.message);
            }
        }

        if (folders.length === 0) return;

        // Processa imagens com limite de concorrência BAIXO
        const imageTasks: Array<Promise<{ count: number, size: number }>> = [];

        for (const folder of folders) {
            const task = this.processFolderImages(folder, archive);
            imageTasks.push(task);
        }

        const results = await Promise.allSettled(imageTasks);

        let totalCount = 0;
        let totalSize = 0;

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                totalCount += result.value.count;
                totalSize += result.value.size;
            }
        });

        progress(totalCount, totalSize);
    }

    private async processFolderImages(folder: any, archive: archiver.Archiver): Promise<{ count: number, size: number }> {
        const folderName = folder.name.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s]/gi, '_');
        const images = folder.images || [];

        let processedCount = 0;
        let processedSize = 0;

        // Processa imagens em MICRO-BATCHES de 2 por vez
        const IMAGE_BATCH_SIZE = 2;

        for (let i = 0; i < images.length; i += IMAGE_BATCH_SIZE) {
            const batch = images.slice(i, i + IMAGE_BATCH_SIZE);
            const batchPromises = batch.map((url, index) =>
                this.addImageToArchive(url, folderName, i + index + 1, archive)
            );

            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    processedCount++;
                    processedSize += result.value.size;
                }
            });

            // Pequena pausa entre micro-batches
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return { count: processedCount, size: processedSize };
    }


}