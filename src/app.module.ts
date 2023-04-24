/* eslint-disable prettier/prettier */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './controllers/admin/admin.module';
import { UserModule } from './controllers/user/user.module';
import { config } from './config';
import { AlbumModule } from './controllers/album/album.module';
import { RequestModule } from './controllers/request/request.module';
import { FolderModule } from './controllers/folder/folder.module';
import { KeyModule } from './controllers/key/key.module';
import { SwaggerModule } from '@nestjs/swagger';
@Module({
  imports: [
    KeyModule,
    FolderModule,
    RequestModule,
    AlbumModule,
    UserModule,
    SwaggerModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AdminModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }