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
import { Invitation } from './shared/invitation';
import { InvitationDto } from './dto/invitation.dto';
import { InvitationService } from './shared/invitation.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Convites')
@Controller('invitation')
export class InvitationController {
  constructor(private invitService: InvitationService) { }

  @Get()
  @ApiOperation({ summary: 'Listar convite', description: 'Lista todos os convites do banco de dados.' })
  async list(): Promise<Invitation[]> {
    return this.invitService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar convite por ID', description: 'Passando o id como parametro, retornar o convite desejado.' })
  async getById(@Param('id') id: string): Promise<Invitation> {
    return this.invitService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar convite', description: 'Cria um convite.' })
  @ApiBody({ type: InvitationDto })
  async create(@Body() convite: Invitation): Promise<Invitation> {
    return this.invitService.create(convite);
  }

  @Put(':id/')
  @ApiOperation({ summary: 'Editar convite', description: 'Passando o id como parametro ele atualiza o convite requisitado.' })
  async update(@Param('id') id: string, @Body() convite: Invitation): Promise<Invitation> {
    return this.invitService.update(id, convite);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar escolha de convite', description: 'Passando o id como parametro ele deleta o convite requisitado.' })
  async delete(@Param('id') id: string) {
    this.invitService.delete(id);
  }

  @Get('album/:id')
  @ApiOperation({ summary: 'Verificar albumID', description: 'Verifica se o album já possui um convite gerado, se tiver retorna verdadeiro, caso contrário retorna falso' })
  async getByAlbumId(@Param('id') id: string): Promise<boolean> {
    return this.invitService.findByAlbumId(id);
  }

}