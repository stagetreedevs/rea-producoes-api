/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from './schema/album.schema';
import { AlbumService } from './shared/album.service';
import { AlbumController } from './album.controller';
import { FolderModule } from '../folder/folder.module';
import { KeyModule } from '../key/key.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema }]),
    FolderModule,
    KeyModule
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
