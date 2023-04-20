/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class AlbumDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    cover: string;

    @ApiProperty()
    galery: [string];

    @ApiProperty()
    created_at: Date;
}