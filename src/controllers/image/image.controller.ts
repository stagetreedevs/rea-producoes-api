/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from './shared/image';
import { ImageService } from './shared/image.service';
import { PaginationParams } from './shared/paginationParams';
@Controller('image')
export class ImageController {
    constructor(
        private imgService: ImageService
    ) {}

    @Get('page')
    async getAllPosts(@Query() { skip, limit }: PaginationParams) {
        return this.imgService.findAll(skip, limit);
    }

    @Get()
    async list() : Promise<Image[]>{
        return this.imgService.list();
    }

    @Get('search')
    async filter(@Query() { brand, type, ref, name }, @Query() { skip, limit }: PaginationParams) {
        return this.imgService.searchPages(brand, type, ref, name, skip, limit);
    }

    @Get(':id')
    async getById(@Param('id') id: string) : Promise<Image>{
        return this.imgService.getById(id);
    }

    @Post(':brand_id/:type_id')
    async create(@Body() image: Image, @Param('brand_id') brand_id: string, @Param('type_id') type_id: string): Promise<Image>{
        return this.imgService.create(image, brand_id, type_id);
    }

    @Put(':id/')
    async update(@Param('id') id: string, @Body() image: Image): Promise<Image>{
        return this.imgService.update(id, image);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        this.imgService.delete(id)
    }

    @Post('download')
    async downloadZip(@Body() images: string[]) {
        return this.imgService.downloadS3FolderAsZip('', images);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file) {
        return this.imgService.upload(file);
    }
}