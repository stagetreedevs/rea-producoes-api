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
import { Request } from './shared/request';
import { RequestService } from './shared/request.service';
import { RequestDto } from './dto/request.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
@Controller('request')
export class RequestController {
  constructor(private reqService: RequestService) { }

  @Get()
  @ApiOperation({ summary: 'Listar requisições', description: 'Lista todas as requisições do banco de dados.' })
  async list(): Promise<Request[]> {
    return this.reqService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar requisições por ID', description: 'Passando o id como parametro, retornar a requisições desejado.' })
  async getById(@Param('id') id: string): Promise<Request> {
    return this.reqService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar requisições', description: 'Cria um requisições.' })
  @ApiBody({ type: RequestDto })
  async create(@Body() req: Request): Promise<Request> {
    return this.reqService.create(req);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar requisições', description: 'Passando o id como parametro ele atualiza a requisições requisitado.' })
  async update(@Param('id') id: string, @Body() req: Request): Promise<Request> {
    return this.reqService.update(id, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar requisições', description: 'Passando o id como parametro ele deleta a requisições requisitado.' })
  async delete(@Param('id') id: string) {
    this.reqService.delete(id);
  }

}