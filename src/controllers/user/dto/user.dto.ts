/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    is_user: boolean;
    
    @ApiProperty()
    album: [string];

    @ApiProperty()
    created_at: Date;
}