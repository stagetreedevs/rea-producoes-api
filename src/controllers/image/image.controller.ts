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
import { Image } from './shared/image';
import { ImageService } from './shared/image.service';
import { ImageDto } from './dto/image.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Imagens')
@Controller('image')
export class ImageController {
  constructor(private imgService: ImageService) { }

  @Get()
  @ApiOperation({ summary: 'Listar imagens', description: 'Lista todas as imagens do banco de dados.' })
  async list(): Promise<Image[]> {
    return this.imgService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar imagens por ID', description: 'Passando o id como parametro, retornar a imagens desejado.' })
  async getById(@Param('id') id: string): Promise<Image> {
    return this.imgService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Escolher imagens', description: 'Cria uma notificação de imagem.' })
  @ApiBody({ type: ImageDto })
  async create(@Body() img: Image): Promise<Image> {
    return this.imgService.create(img);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar imagens', description: 'Passando o id como parametro ele atualiza a imagens requisitado.' })
  async update(@Param('id') id: string, @Body() img: Image): Promise<Image> {
    return this.imgService.update(id, img);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar escolha de imagens', description: 'Passando o id como parametro ele deleta a imagens requisitado.' })
  async delete(@Param('id') id: string) {
    this.imgService.delete(id);
  }

}