/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from './shared/image.service';
import { ImageController } from './image.controller';
import { ImageSchema } from './schema/image.schema';
// import { BrandModule } from '../brand/brand.module';
// import { TypeModule } from '../type/type.module';
// import { BrandSchema } from '../brand/schema/brand.schema';
// import { TypeSchema } from '../type/schema/type.schema';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Image', schema: ImageSchema},
            // { name: 'Brand', schema: BrandSchema },
            // { name: 'Type', schema: TypeSchema }
        ]),
        // BrandModule,
        // TypeModule
    ],
    controllers: [
        ImageController,
    ],
    providers: [
        ImageService,
    ],
    exports: [
        ImageService,
    ]
})
export class ImageModule { }