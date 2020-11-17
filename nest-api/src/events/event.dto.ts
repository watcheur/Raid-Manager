import { ApiProperty } from '@nestjs/swagger';
import { Raid, RaidDifficulty } from 'src/raids/raid.entity';

export class EventDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly schedule: Date;

    @ApiProperty()
    readonly difficulty: RaidDifficulty;

    @ApiProperty()
    readonly raid: number;
}