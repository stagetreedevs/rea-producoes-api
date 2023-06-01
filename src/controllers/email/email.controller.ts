/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer'
import { Controller, Get, Query } from '@nestjs/common';
@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService) { }
    @Get()
    async textEmail(@Query('toEmail') toEmail, @Query('title') title, @Query('message') message) {
        return await this.mailService.sendMail({
            to: toEmail,
            from: 'apistagetree@gmail.com',
            subject: title,
            html: message
        });
    }

    @Get('app/admin')
    async sendAdminEmail(
        @Query('toEmail') toEmail,
        @Query('type') type,
        @Query('course') course,
        @Query('classe') classe,
        @Query('nome') nome,
        @Query('imageUrl') imageUrl,
    ) {
        const titleContent = `${type} ${course}`;
        const htmlContent = `<h2>Imagem escolhida por ${nome}</h2>.<br> <h3>Curso:${course}</h3><br> <h3>Turma:${classe}</h3><br><p><a href="${imageUrl}">Clique aqui</a></p>`;
        return await this.mailService.sendMail({
            to: toEmail,
            from: 'apistagetree@gmail.com',
            subject: titleContent,
            html: htmlContent
        });
    }

    @Get('app/user')
    async sendUserEmail(
        @Query('toEmail') toEmail,
        @Query('type') type,
        @Query('imageUrl') imageUrl,
    ) {
        const titleContent = `Sua imagem foi enviada com sucesso!`;
        const htmlContent = `<h2>Imagem escolhida para ${type}</h2>.<br><p><a href="${imageUrl}">Link da imagem</a></p>`;
        return await this.mailService.sendMail({
            to: toEmail,
            from: 'apistagetree@gmail.com',
            subject: titleContent,
            html: htmlContent
        });
    }
}