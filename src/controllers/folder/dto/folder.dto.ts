/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class FolderDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    images: [string];

    @ApiProperty()
    folder: [string];

    @ApiProperty()
    options: [string];

    @ApiProperty()
    sharing: boolean;

    @ApiProperty()
    child: boolean;

    @ApiProperty()
    father: string;

    @ApiProperty()
    created_at: Date;
}