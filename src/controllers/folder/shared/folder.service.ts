/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder } from './folder';
import { forkJoin } from 'rxjs';
import { RenameFolderDto } from '../dto/folder.dto';
import { Response } from 'express';
import * as archiver from 'archiver';
import axios from 'axios';

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

    // Método otimizado para download - retorna apenas dados necessários
    async getFolderForDownload(id: string): Promise<{ name: string, images: string[] } | null> {
        const folder = await this.folderModel.findById(id)
            .select('name images')
            .lean();

        if (!folder) return null;

        return {
            name: folder.name,
            images: folder.images || []
        };
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

    async removeImages(id: string, imageToRemove: string) {
        const updatedFolder = await this.folderModel.findByIdAndUpdate(
            id,
            { $pull: { images: imageToRemove } },
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

    async downloadFolderAsZip(folderId: string, res: Response): Promise<void> {
        // Busca apenas dados essenciais para o download
        const folder = await this.folderModel.findById(folderId)
            .select('name images')
            .lean();

        if (!folder) {
            throw new NotFoundException('Pasta não encontrada');
        }

        const zipFilename = `${folder.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;

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

            // Processa imagens em MICRO-BATCHES para controle de memória
            const BATCH_SIZE = 2; // Apenas 2 imagens concorrentes
            const images = folder.images || [];

            for (let i = 0; i < images.length; i += BATCH_SIZE) {
                const batch = images.slice(i, i + BATCH_SIZE);

                const batchResults = await this.processImageBatch(
                    batch,
                    folder.name,
                    i,
                    archive
                );

                processedFiles += batchResults.count;
                totalSize += batchResults.size;

                // Pausa estratégica entre batches para liberar memória
                await new Promise(resolve => setTimeout(resolve, 200));

                // Força GC a cada 20 imagens processadas se disponível
                if (global.gc && i > 0 && i % 20 === 0) {
                    global.gc();
                }

                // Verifica se o cliente ainda está conectado
                if (res.finished || res.socket?.destroyed) {
                    break;
                }
            }

            await archive.finalize();

        } catch (error) {
            console.error('Erro crítico ao gerar ZIP da pasta:', error);
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

    private async processImageBatch(
        imageUrls: string[],
        folderName: string,
        startIndex: number,
        archive: archiver.Archiver
    ): Promise<{ count: number, size: number }> {
        const batchPromises = imageUrls.map((url, batchIndex) =>
            this.downloadAndAddImage(url, folderName, startIndex + batchIndex + 1, archive)
        );

        const results = await Promise.allSettled(batchPromises);

        let processedCount = 0;
        let processedSize = 0;

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                processedCount++;
                processedSize += result.value.size;
            }
        });

        return { count: processedCount, size: processedSize };
    }

    private async downloadAndAddImage(
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
                timeout: 45000, // 45 segundos timeout
                maxContentLength: 100 * 1024 * 1024, // 100MB max por arquivo
                decompress: false, // Não descomprimir automaticamente
                headers: {
                    'Accept-Encoding': 'identity' // Evitar compressão na resposta
                }
            });

            const extension = this.getFileExtension(url);
            const safeFolderName = folderName.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s]/gi, '_');
            const filename = `imagem_${index}.${extension}`;
            const fullPath = `${safeFolderName}/${filename}`;

            return new Promise((resolve, reject) => {
                let size = 0;

                response.data.on('data', (chunk: Buffer) => {
                    size += chunk.length;
                });

                response.data.on('end', () => {
                    console.log(`✓ Imagem ${index} adicionada: ${Math.round(size / 1024)}KB`);
                    resolve({ size });
                });

                response.data.on('error', (error) => {
                    console.error(`✗ Erro no stream da imagem ${index}:`, error.message);
                    reject(error);
                });

                // Adiciona o stream diretamente ao archive
                archive.append(response.data, { name: fullPath });

            });

        } catch (error) {
            console.error(`✗ Falha no download da imagem ${index}:`, error.message);

            // Adiciona um arquivo de erro placeholder para manter a estrutura
            const errorMessage = `Falha no download: ${url}`;
            archive.append(errorMessage, {
                name: `${folderName}/erro_imagem_${index}.txt`
            });

            return { size: 0 };
        }
    }

    private getFileExtension(url: string): string {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const parts = pathname.split('.');

            if (parts.length > 1) {
                const ext = parts.pop()?.toLowerCase() || 'jpg';
                // Valida se é uma extensão de imagem conhecida
                const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'avi', 'mov'];
                return validExtensions.includes(ext) ? ext : 'jpg';
            }
        } catch {
            // Fallback para parsing simples
            const urlWithoutParams = url.split('?')[0];
            const parts = urlWithoutParams.split('.');
            return parts.length > 1 ? parts.pop()?.toLowerCase() || 'jpg' : 'jpg';
        }
        return 'jpg';
    }

    // Método alternativo para download rápido (sem batches) para pastas pequenas
    async downloadFolderAsZipFast(folderId: string, res: Response): Promise<void> {
        const folder = await this.folderModel.findById(folderId)
            .select('name images')
            .lean();

        if (!folder) {
            throw new NotFoundException('Pasta não encontrada');
        }

        // Para pastas com poucas imagens, usa processamento mais rápido
        if (folder.images.length <= 10) {
            return this.downloadSmallFolder(folder, res);
        } else {
            // Para pastas grandes, usa o método com batches
            return this.downloadFolderAsZip(folderId, res);
        }
    }

    private async downloadSmallFolder(
        folder: { name: string; images: string[] },
        res: Response
    ): Promise<void> {
        const zipFilename = `${folder.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;

        res.setHeader('Content-Disposition', `attachment; filename=${zipFilename}`);
        res.setHeader('Content-Type', 'application/zip');

        const archive = archiver('zip', {
            zlib: { level: 1 },
            highWaterMark: 128 * 1024 // 128KB para pastas pequenas
        });

        archive.pipe(res);

        try {
            console.log(`Processamento rápido para pasta pequena: ${folder.name} (${folder.images.length} imagens)`);

            // Para poucas imagens, processa todas de uma vez
            const imagePromises = folder.images.map((url, index) =>
                this.downloadAndAddImage(url, folder.name, index + 1, archive)
            );

            await Promise.allSettled(imagePromises);
            await archive.finalize();

        } catch (error) {
            console.error('Erro no download rápido:', error);
            if (!res.headersSent) {
                res.status(500).send('Erro ao gerar arquivo ZIP');
            }
        }
    }

}