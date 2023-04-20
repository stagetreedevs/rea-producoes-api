/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class KeyDto {
    @ApiProperty()
    album: string;
    
    @ApiProperty()
    value: string;

    @ApiProperty()
    expirationDate: Date;

    @ApiProperty()
    created_at: Date;
}