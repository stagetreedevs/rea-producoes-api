/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Post, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-dist';
@ApiTags('API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api')
  getSwagger(@Res() response: Response) {
    const document = YAML.load('./swagger.yaml');
    const html = swaggerUi.generateHTML(document, {
      css: '/swagger-ui.css'
    });
    response.setHeader('Content-Type', 'text/html');
    response.send(html);
  }

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
