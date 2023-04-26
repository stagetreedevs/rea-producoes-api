/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Key } from './shared/key';
import { KeyService } from './shared/key.service';
import { Album } from '../album/shared/album';
import { KeyDto } from './dto/key.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chave')
@Controller('key')
export class KeyController {
  constructor(private keyService: KeyService) { }

  @Get()
  @ApiOperation({ summary: 'Listar chaves', description: 'Lista todas as chaves do banco de dados.' })
  async list(): Promise<Key[]> {
    return this.keyService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar chave por ID', description: 'Passando o id como parametro, retornar a chave desejado.' })
  async getById(@Param('id') id: string): Promise<Key> {
    return this.keyService.getById(id);
  }

  @Get('value/:id')
  @ApiOperation({ summary: 'Listar chave por ID do album', description: 'Passando o id como parametro, retornar a chave desejado.' })
  async getByAlbum(@Param('id') id: string): Promise<Key> {
    return this.keyService.getByAlbum(id);
  }

  @Get('album/:id')
  @ApiOperation({ summary: 'Listar album por chave', description: 'Passando o id como parametro, retornar o album que contem na chave.' })
  async getKeyValue(@Param('id') id: string): Promise<Album> {
    return this.keyService.getKeyValue(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar chave', description: 'Cria um chave.' })
  @ApiBody({ type: KeyDto })
  async create(@Body() chave: Key): Promise<Key> {
    return this.keyService.create(chave);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar chave', description: 'Passando o id como parametro ele atualiza a chave requisitado.' })
  async update(@Param('id') id: string, @Body() chave: Key): Promise<Key> {
    return this.keyService.update(id, chave);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar chave', description: 'Passando o id como parametro ele deleta a chave requisitado.' })
  async delete(@Param('id') id: string) {
    this.keyService.delete(id);
  }

}
