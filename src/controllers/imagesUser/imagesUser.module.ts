/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageUserSchema } from './schema/imagesUser.schema';
import { ImagesUserService } from './shared/imagesUser.service';
import { ImagesUserController } from './imagesUser.controller';
import { KeyModule } from '../key/key.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ImagesUser', schema: ImageUserSchema }]), KeyModule
  ],
  controllers: [ImagesUserController],
  providers: [ImagesUserService],
  exports: [ImagesUserService],
})
export class ImagesUserModule { }
