/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AdminModule } from 'src/controllers/admin/admin.module';
@Module({
  imports:[AdminModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}