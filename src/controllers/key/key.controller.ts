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
@Controller('key')
export class KeyController {
  constructor(private keyService: KeyService) { }

  @Get()
  async list(): Promise<Key[]> {
    return this.keyService.list();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Key> {
    return this.keyService.getById(id);
  }

  @Post()
  async create(@Body() chave: Key): Promise<Key> {
    return this.keyService.create(chave);
  }

  @Put(':id/')
  async update(@Param('id') id: string, @Body() chave: Key): Promise<Key> {
    return this.keyService.update(id, chave);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.keyService.delete(id);
  }

}
