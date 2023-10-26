/* eslint-disable prettier/prettier */
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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from './shared/request';
import { RequestService } from './shared/request.service';
import { RequestDto } from './dto/request.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
@ApiTags('Requisições')
@Controller('request')
export class RequestController {
  constructor(private reqService: RequestService) { }

  @Get()
  @ApiOperation({ summary: 'Listar requisições', description: 'Lista todas as requisições do banco de dados.' })
  async list(): Promise<Request[]> {
    return this.reqService.list();
  }

  @Get('keys')
  @ApiOperation({ summary: 'Listar turmas que possuem materiais enviados' })
  async getClassKey(): Promise<any[]> {
    return this.reqService.getClassKey();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar requisições por ID', description: 'Passando o id como parametro, retornar a requisições desejado.' })
  async getById(@Param('id') id: string): Promise<Request> {
    return this.reqService.getById(id);
  }

  @Get('verify/:email')
  @ApiOperation({ summary: 'Verificar email', description: 'Verifica se o email passado na requisição já foi utilizado.' })
  async verifyEmail(@Param('email') email: string) {
    return this.reqService.verifyEmail(email);
  }

  @Get('class/:key')
  @ApiOperation({ summary: 'Listar requisições por Chave da Turma' })
  async findByClassKey(@Param('key') key: string) {
    return this.reqService.findByClassKey(key);
  }

  @Get('class/:key/download')
  @ApiOperation({ summary: 'Retorna apenas os campos name, linkMusic e images das requisições por Chave da Turma' })
  async findByClassKeyWithName(@Param('key') key: string) {
    return this.reqService.findByClassKeyWithName(key);
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

  @Post('upload')
  @ApiOperation({ summary: 'Upload firebase', description: 'Passando email e arquivo .mp3 ele irá gerar um link firebase referente ao arquivo.' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Query() email: any, @UploadedFile() file) {
    return this.reqService.upload(email, file);
  }

  @Post('uploadAll')
  @ApiOperation({ summary: 'Upload firebase', description: 'Passe o email e um array de arquivos. Ele irá retorna um array com todas as urls geradas pelo firebase.' })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadAll(@UploadedFiles() files: Express.Multer.File[]) {
    const email = {};
    const links = await this.reqService.uploadAll(email, files);
    return { links };
  }

}