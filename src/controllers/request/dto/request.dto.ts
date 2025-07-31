/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
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
    linkMusic: string;

    @ApiProperty()
    images: [string];

    @ApiProperty()
    created_at: Date;
}

export class CombinedRequestDto {
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

}