/* eslint-disable prettier/prettier */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './controllers/admin/admin.module';
import { config } from './config';
import { AlbumModule } from './controllers/album/album.module';
import { RequestModule } from './controllers/request/request.module';
import { FolderModule } from './controllers/folder/folder.module';
import { KeyModule } from './controllers/key/key.module';
import { SwaggerModule } from '@nestjs/swagger';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './controllers/email/email.controller';
import { InvitationModule } from './controllers/invitation/invitation.module';
import { ImagesUserModule } from './controllers/imagesUser/imagesUser.module';
import { environment } from './environment';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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'
        }
      }
    }),
    ImagesUserModule,
    InvitationModule,
    KeyModule,
    FolderModule,
    RequestModule,
    AlbumModule,
    SwaggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    MongooseModule.forRoot(environment.DB_URL),
    AdminModule,
    AuthModule
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule { }