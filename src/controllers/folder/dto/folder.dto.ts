/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class FolderDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    images: [string];

    @ApiProperty()
    created_at: Date;
}