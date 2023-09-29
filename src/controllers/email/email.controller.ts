/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailerService } from '@nestjs-modules/mailer'
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService) { }
    @Get()
    async textEmail(@Query('toEmail') toEmail, @Query('title') title, @Query('message') message) {
        return await this.mailService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: title,
            html: message
        });
    }

    @Post('app/admin')
    async sendToAdmin(@Body() body: any) {
        const {
            toEmail,
            type,
            course,
            classe,
            nome,
            imageUrl
        } = body;

        const titleContent = `${type} ${course}`;
        const htmlContent = `<h2>Imagem escolhida por ${nome}</h2>.<br> <h3>Curso:${course}</h3><br> <h3>Turma:${classe}</h3><br><p><a href="${imageUrl}">Clique aqui</a></p>`;

        return await this.mailService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: titleContent,
            html: htmlContent
        });
    }

    @Post('app/user')
    async sendUserEmail(@Body() body: any) {
        const {
            toEmail,
            type,
            imageUrl
        } = body;

        const titleContent = `Sua imagem foi enviada com sucesso!`;
        const htmlContent = `
        <p>Ebaaaa!</p><br>
        <p>Recebemos seu material com sucesso!</p>
        <p>Informamos que caso ocorra algum problema com os arquivos enviados, nossa equipe entrará em contato. Portanto, fique tranquilo.</p><br>
        <p>Com carinho,</p>
        <p>Equipe R&A</p>
        <p>#VIVAESSAEXPERIENCIA</p>`;

        return await this.mailService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: titleContent,
            html: htmlContent
        });
    }

    @Post('request/admin')
    async reqToAdmin(@Body() body: any) {
        const {
            toEmail,
            course,
            classe,
            nome,
        } = body;

        const titleContent = `Requisição solicitada por ${nome}`;
        const htmlContent = `<h2>Aluno ${nome}</h2>.<br> <h3>Curso:${course}</h3><br> <h3>Turma:${classe}</h3><br>`;

        return await this.mailService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: titleContent,
            html: htmlContent
        });
    }

    @Post('request/user')
    async reqToUser(@Body() body: any) {
        const {
            toEmail,
        } = body;

        const titleContent = `Requisição enviada!`;
        const htmlContent =
            `<p>Ebaaaa!</p><br>
            <p>Recebemos seu material com sucesso!</p>
            <p>Informamos que caso ocorra algum problema com os arquivos enviados, nossa equipe entrará em contato. Portanto, fique tranquilo.</p><br>
            <p>Com carinho,</p>
            <p>Equipe R&A</p>
            <p>#VIVAESSAEXPERIENCIA</p>`;

        return await this.mailService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: titleContent,
            html: htmlContent
        });
    }
}