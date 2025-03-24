/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer'
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailDto } from './dto/email.dto'; // Import the new DTO

@ApiTags('Email')
@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService) { }
    @Post('app/user')
    @ApiBody({ type: EmailDto })
    async sendUserEmail(@Body() body: EmailDto) {
        const { toEmail } = body;
        const titleContent = `Suas imagens foram enviadas com sucesso!`;
        const htmlContent = `
        <p>Ebaaaa!</p><br>
        <p>Recebemos seu envio com sucesso!</p>
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

    @Post('request/user')
    @ApiBody({ type: EmailDto })
    async reqToUser(@Body() body: EmailDto) {
        const { toEmail } = body;
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