import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendUserEmail(toEmail: string): Promise<void> {
        const titleContent = `Suas imagens foram enviadas com sucesso!`;
        const htmlContent = `
      <p>Ebaaaa!</p><br>
      <p>Recebemos seu envio com sucesso!</p>
      <p>Informamos que caso ocorra algum problema com os arquivos enviados, nossa equipe entrará em contato. Portanto, fique tranquilo.</p><br>
      <p>Com carinho,</p>
      <p>Equipe R&A</p>
      <p>#VIVAESSAEXPERIENCIA</p>`;

        await this.mailerService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: titleContent,
            html: htmlContent,
        });
    }

    async reqToUser(toEmail: string): Promise<void> {
        const titleContent = `Requisição enviada!`;
        const htmlContent =
            `<p>Ebaaaa!</p><br>
                <p>Recebemos seu material com sucesso!</p>
                <p>Informamos que caso ocorra algum problema com os arquivos enviados, nossa equipe entrará em contato. Portanto, fique tranquilo.</p><br>
                <p>Com carinho,</p>
                <p>Equipe R&A</p>
                <p>#VIVAESSAEXPERIENCIA</p>`;

        return await this.mailerService.sendMail({
            to: toEmail,
            from: 'noreply@reaproducoes.com',
            subject: titleContent,
            html: htmlContent
        });
    }
}