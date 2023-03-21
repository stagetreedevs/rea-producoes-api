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
import { User } from './shared/user';
import { UserService } from './shared/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async list(): Promise<User[]> {
    return this.userService.list();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id/')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.userService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    return this.userService.upload(file);
  }
}
