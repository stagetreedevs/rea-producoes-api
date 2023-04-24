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
import { User } from './shared/user';
import { UserService } from './shared/user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @ApiOperation({ summary: 'Listar usuários', description: 'Lista todos os usuários do banco de dados.' })
  async list(): Promise<User[]> {
    return this.userService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar usuário por ID', description: 'Passando o id como parametro, retornar o usuário desejado.' })
  async getById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar usuário', description: 'Cria um usuário.' })
  @ApiBody({ type: UserDto })
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar usuário', description: 'Passando o id como parametro ele atualiza o usuário requisitado.' })
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário', description: 'Passando o id como parametro ele deleta o usuário requisitado.' })
  async delete(@Param('id') id: string) {
    this.userService.delete(id);
  }

}
