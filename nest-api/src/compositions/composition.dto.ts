import { ApiProperty } from '@nestjs/swagger';

export class CompositionDto {
    @ApiProperty()
    readonly event: number;

    @ApiProperty()
    readonly encounter: number;

    @ApiProperty()
    readonly note: number;
}