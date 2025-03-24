import { Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login', description: 'Passe um email e uma senha válida para entrar no sistema.' })
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Get()
  @ApiOperation({ summary: 'Mensagem inicial do sistema' })
  getHello(): string {
    return this.appService.getHello();
  }
}