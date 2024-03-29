/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationSchema } from './schema/invitation.schema';
import { InvitationService } from './shared/invitation.service';
import { InvitationController } from './invitation.controller';
import { KeyModule } from '../key/key.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invitation', schema: InvitationSchema }]), KeyModule
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule { }
