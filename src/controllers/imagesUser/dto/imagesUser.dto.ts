/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ImagesUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    class_key: string;

    @ApiProperty()
    course: string;

    @ApiProperty()
    class: string;

    @ApiProperty()
    album: string;

    @ApiProperty()
    ledPanel: [string];

    @ApiProperty()
    picture: [string];
    
    @ApiProperty()
    created_at: Date;
}