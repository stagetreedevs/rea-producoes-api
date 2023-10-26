/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class InvitationDto {
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
    image: string;

    @ApiProperty()
    album: string;
    
    @ApiProperty()
    created_at: Date;
}