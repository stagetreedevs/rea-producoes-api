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
} from '@nestjs/common';
import { Folder } from './shared/folder';
import { FolderService } from './shared/folder.service';

@Controller('folder')
export class FolderController {
  constructor(private folderService: FolderService) { }

  @Get()
  async list(): Promise<Folder[]> {
    return this.folderService.list();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Folder> {
    return this.folderService.getById(id);
  }

  @Post()
  async create(@Body() folder: Folder): Promise<Folder> {
    return this.folderService.create(folder);
  }

  @Put(':id/')
  async update(@Param('id') id: string, @Body() folder: Folder): Promise<Folder> {
    return this.folderService.update(id, folder);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.folderService.delete(id);
  }

}
