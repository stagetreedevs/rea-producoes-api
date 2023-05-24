/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from '../album/schema/album.schema';
import { KeySchema } from './schema/key.schema';
import { KeyService } from './shared/key.service';
import { KeyController } from './key.controller';
import { FolderModule } from '../folder/folder.module';
@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: 'Key', schema: KeySchema },
      { name: 'Album', schema: AlbumSchema }
    ]),
    FolderModule
  ],
  controllers: [KeyController],
  providers: [KeyService],
  exports: [KeyService],
})
export class KeyModule { }
