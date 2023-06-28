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
    sharing: boolean;

    @ApiProperty()
    child: boolean;

    @ApiProperty()
    father: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    invitation: boolean;

    @ApiProperty()
    picture: boolean;

    @ApiProperty()
    photobook: boolean;

    @ApiProperty()
    LEDpanel: boolean;
}