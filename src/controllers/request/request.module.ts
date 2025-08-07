/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './schema/request.schema';
import { RequestService } from './shared/request.service';
import { RequestController } from './request.controller';
import { KeyModule } from '../key/key.module';
import { EmailModule } from '../email/email.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    KeyModule,
    EmailModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule { }
