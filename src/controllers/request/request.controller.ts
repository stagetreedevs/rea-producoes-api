/* eslint-disable prettier/prettier */
import {
  BadRequestException,
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
import { CombinedRequestDto, RequestDto } from './dto/request.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
class MusicDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
class FileDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: Express.Multer.File[];
}
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

  @Post()
  @ApiOperation({ summary: 'Criar requisições', description: 'Cria um requisições.' })
  @ApiBody({ type: RequestDto })
  async create(@Body() req: Request): Promise<Request> {
    return this.reqService.create(req);
  }

  @Post('combined')
  @ApiOperation({
    summary: 'Criar requisição com uploads',
    description: 'Combina upload de imagens, música e criação de requisição em uma única chamada.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'linkMusic', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]))
  @ApiBody({ type: CombinedRequestDto })
  async createWithUploads(
    @UploadedFiles() files: {
      linkMusic?: Express.Multer.File[],
      images?: Express.Multer.File[]
    },
    @Body() body: Omit<CombinedRequestDto, 'images' | 'linkMusic'>,
  ) {
    const linkMusic = files.linkMusic?.[0];
    const images = files.images || [];
    if (!linkMusic) {
      throw new BadRequestException('Arquivo de música é obrigatório');
    }
    // 1. Upload das imagens
    const imageLinks = await this.reqService.uploadAll(body.email, images);
    // 2. Upload da música
    const musicLink = await this.reqService.upload(body.email, linkMusic);
    // 3. Criar a requisição com os links gerados

    const requestData: any = {
      ...body,
      images: imageLinks as [string],
      linkMusic: musicLink.url,
      created_at: new Date(),
    };

    return this.reqService.create(requestData);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Upload firebase',
    description: 'Passando email e arquivo .mp3 ele irá gerar um link firebase referente ao arquivo.'
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: MusicDto })
  async upload(
    @Query('email') email: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.reqService.upload(email, file);
  }

  @Post('uploadAll')
  @ApiOperation({
    summary: 'Upload firebase',
    description: 'Passe o email e um array de arquivos. Ele irá retornar um array com todas as URLs geradas pelo firebase.'
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({ type: FileDto })
  async uploadAll(
    @Query('email') email: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const links = await this.reqService.uploadAll(email, files);
    return { links };
  }

}