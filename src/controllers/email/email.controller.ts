/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailDto } from './dto/email.dto';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Post('app/user')
    @ApiBody({ type: EmailDto })
    async sendUserEmail(@Body() body: EmailDto) {
        await this.emailService.sendUserEmail(body.toEmail);
    }

    @Post('request/user')
    @ApiBody({ type: EmailDto })
    async reqToUser(@Body() body: EmailDto) {
        await this.emailService.reqToUser(body.toEmail);
    }

}