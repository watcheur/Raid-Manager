import { ApiProperty } from '@nestjs/swagger';

export class EventDuplicateDto {
    @ApiProperty()
    readonly date: Date;
}