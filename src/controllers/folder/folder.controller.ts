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
import { FolderDto, RenameFolderDto } from './dto/folder.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Pastas')
@Controller('folder')
export class FolderController {
  constructor(private folderService: FolderService) { }

  @Get()
  @ApiOperation({ summary: 'Listar pastas', description: 'Lista todas as pastas na raiz do firebase.' })
  async getRoot(): Promise<Folder[]> {
    const folders = this.folderService.list();
    const filteredFolders = (await folders).filter(folder => folder.child === false);
    return filteredFolders;
  }

  @Get('all')
  @ApiOperation({ summary: 'Listar pastas', description: 'Lista todas as pastas do banco de dados.' })
  async list(): Promise<Folder[]> {
    return this.folderService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar pasta por ID', description: 'Passando o id como parametro, retornar a pasta desejado.' })
  async getById(@Param('id') id: string): Promise<Folder> {
    return this.folderService.getById(id);
  }

  @Get(':id/tamanho')
  async getByIdLength(@Param('id') id: string): Promise<any> {
    return this.folderService.getByIdLength(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Listar pasta por nome', description: 'Passando o nome como parametro, retornar a pasta desejado.' })
  async getFolderByName(@Param('name') name: string) {
    return this.folderService.getByName(name);
  }

  @Get('folders/:id')
  @ApiOperation({ summary: 'Listar pastas dentro de outra pasta por ID', description: 'Passando o id como parametro, retornar as pastas que estão contidas na pasta passada.' })
  async getFolders(@Param('id') id: string): Promise<any> {
    return this.folderService.getFolders(id);
  }

  @Get('files/:id')
  @ApiOperation({ summary: 'Videos e Imagens', description: 'Passando o id como parametro, retornar as pastas que estão contidas na pasta passada.' })
  async getVideos(@Param('id') id: string): Promise<any> {
    return this.folderService.getVideos(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar pasta', description: 'Cria um pasta.' })
  @ApiBody({ type: FolderDto })
  async create(@Body() folder: Folder): Promise<Folder> {
    return this.folderService.create(folder);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar pasta', description: 'Passando o id como parametro ele atualiza a pasta requisitado.' })
  async update(@Param('id') id: string, @Body() folder: Folder): Promise<Folder> {
    return this.folderService.update(id, folder);
  }

  @Put(':id/rename')
  @ApiOperation({ summary: 'Renomear pasta' })
  async rename(@Param('id') id: string, @Body() body: RenameFolderDto): Promise<Folder> {
    return this.folderService.rename(id, body);
  }

  @Put(':id/update-images')
  @ApiOperation({ summary: 'Atualizar imagens da pasta', description: 'Passando o ID da pasta e a URL da imagem no corpo da requisição para adicionar uma nova imagem à pasta.' })
  async updateImages(@Param('id') id: string, @Body('imageUrl') imageUrl: string): Promise<Folder> {
    return this.folderService.updateImages(id, imageUrl);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar pasta', description: 'Passando o id como parametro ele deleta a pasta requisitado.' })
  async delete(@Param('id') id: string) {
    this.folderService.delete(id);
  }

}
