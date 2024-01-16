/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}

export class AppImagesDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    course: string;

    @ApiProperty()
    @IsString()
    class: string;

    @ApiProperty()
    @IsString()
    class_key: string;

    @ApiProperty()
    @IsString()
    album: string;

    @ApiProperty()
    @IsString()
    ledPanel: string;

    @ApiProperty()
    @IsString()
    picture: string;

}