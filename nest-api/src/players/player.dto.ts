import { ApiProperty } from '@nestjs/swagger';
import { Rank } from './player.entity';

export class PlayerDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty({ type: "enum", enum: Rank })
    readonly rank: Rank;

    @ApiProperty()
    readonly team: number;
}