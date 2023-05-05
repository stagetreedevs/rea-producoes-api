/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    course: string;

    @ApiProperty()
    class: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    album: string;

    @ApiProperty()
    invitation: boolean;

    @ApiProperty()
    picture: boolean;
    
    @ApiProperty()
    created_at: Date;
}