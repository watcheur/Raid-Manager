import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
    @ApiProperty()
    readonly key: string;

    @ApiProperty()
    readonly value: string;
}