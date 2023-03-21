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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from './shared/request';
import { RequestService } from './shared/request.service';

@Controller('request')
export class RequestController {
  constructor(private reqService: RequestService) { }

  @Get()
  async list(): Promise<Request[]> {
    return this.reqService.list();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Request> {
    return this.reqService.getById(id);
  }

  @Post()
  async create(@Body() req: Request): Promise<Request> {
    return this.reqService.create(req);
  }

  @Put(':id/')
  async update(@Param('id') id: string, @Body() req: Request): Promise<Request> {
    return this.reqService.update(id, req);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.reqService.delete(id);
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(@UploadedFile() file) {
  //   return this.reqService.upload(file);
  // }
}
