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
import { FolderDto } from './dto/folder.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Pastas')
@Controller('folder')
export class FolderController {
  constructor(private folderService: FolderService) { }

  @Get()
  @ApiOperation({ summary: 'Listar pastas', description: 'Lista todas as pastas do banco de dados.' })
  async list(): Promise<Folder[]> {
    return this.folderService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar pasta por ID', description: 'Passando o id como parametro, retornar a pasta desejado.' })
  async getById(@Param('id') id: string): Promise<Folder> {
    return this.folderService.getById(id);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar pasta', description: 'Passando o id como parametro ele deleta a pasta requisitado.' })
  async delete(@Param('id') id: string) {
    this.folderService.delete(id);
  }

}
