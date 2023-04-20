/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    course: string;

    @ApiProperty()
    class: string;

    @ApiProperty()
    linkMusic: string;

    @ApiProperty()
    fileMusic: string;
    
    @ApiProperty()
    created_at: Date;
}