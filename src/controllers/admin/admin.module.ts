/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './shared/admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schema/admin.schema';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema}])
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule {}