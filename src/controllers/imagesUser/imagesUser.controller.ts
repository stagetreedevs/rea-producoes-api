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
import { ImagesUser } from './shared/imagesUser';
import { ImagesUserDto } from './dto/imagesUser.dto';
import { ImagesUserService } from './shared/imagesUser.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Imagens dos usuários')
@Controller('imagesUser')
export class ImagesUserController {
  constructor(private imgService: ImagesUserService) { }

  @Get()
  @ApiOperation({ summary: 'Listar imagens', description: 'Lista todas as imagens do banco de dados.' })
  async list(): Promise<ImagesUser[]> {
    return this.imgService.list();
  }

  @Get('keys')
  @ApiOperation({ summary: 'Listar turmas que possuem imagens' })
  async getClassKey(): Promise<any[]> {
    return this.imgService.getClassKey();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar imagens por ID', description: 'Passando o id como parametro, retornar a imagens desejado.' })
  async getById(@Param('id') id: string): Promise<ImagesUser> {
    return this.imgService.getById(id);
  }

  @Get('class/:key')
  @ApiOperation({ summary: 'Listar imagens por Chave da Turma' })
  async findByClassKey(@Param('key') key: string) {
    return this.imgService.findByClassKey(key);
  }

  @Get('class/:key/download')
  @ApiOperation({ summary: 'Retorna apenas campos específicos das imagens por Chave da Turma' })
  async findByClassKeyWithName(@Param('key') key: string) {
    return this.imgService.findByClassKeyWithName(key);
  }

  @Post()
  @ApiOperation({ summary: 'Escolher imagens', description: 'Cria uma notificação de imagem.' })
  @ApiBody({ type: ImagesUserDto })
  async create(@Body() img: ImagesUser): Promise<ImagesUser> {
    return this.imgService.create(img);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar imagens', description: 'Passando o id como parametro ele atualiza a imagens requisitado.' })
  async update(@Param('id') id: string, @Body() img: ImagesUser): Promise<ImagesUser> {
    return this.imgService.update(id, img);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar escolha de imagens', description: 'Passando o id como parametro ele deleta a imagens requisitado.' })
  async delete(@Param('id') id: string) {
    this.imgService.delete(id);
  }

}