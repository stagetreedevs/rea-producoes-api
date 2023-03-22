/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Album } from './shared/album';
import { AlbumService } from './shared/album.service';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async list(): Promise<Album[]> {
    return this.albumService.list();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Album> {
    return this.albumService.getById(id);
  }

  @Post()
  async create(@Body() album: Album): Promise<Album> {
    return this.albumService.create(album);
  }

  @Put(':id/')
  async update(@Param('id') id: string, @Body() album: Album): Promise<Album> {
    return this.albumService.update(id, album);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.albumService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file){
    return this.albumService.upload(file);
  }

}
