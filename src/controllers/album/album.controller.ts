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
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Album } from './shared/album';
import { AlbumService } from './shared/album.service';
import { AlbumDto } from './dto/album.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Listar albuns', description: 'Lista todos os albuns do banco de dados.' })
  async list(): Promise<Album[]> {
    return this.albumService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar album por ID', description: 'Passando o id como parametro, retornar o album desejado.' })
  async getById(@Param('id') id: string): Promise<Album> {
    return this.albumService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar album', description: 'Cria um album.' })
  @ApiBody({ type: AlbumDto })
  async create(@Body() album: Album): Promise<Album> {
    return this.albumService.create(album);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar album', description: 'Passando o id como parametro ele atualiza o album requisitado.' })
  async update(@Param('id') id: string, @Body() album: Album): Promise<Album> {
    return this.albumService.update(id, album);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar album', description: 'Passando o id como parametro ele deleta o album requisitado.' })
  async delete(@Param('id') id: string) {
    this.albumService.delete(id);
  }

  @Post('upload/')
  @ApiOperation({ summary: 'Upload firebase', description: 'Adicionará uma imagem no banco de dados, passando o file e seu caminho.' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Query() path: any, @UploadedFile() file){
    return this.albumService.upload(path, file);
  }

}