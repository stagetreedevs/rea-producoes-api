import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
    @ApiProperty()
    toEmail: string;
}
