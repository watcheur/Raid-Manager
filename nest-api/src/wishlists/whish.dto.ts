import { ApiProperty } from "@nestjs/swagger";
import { RaidDifficulty } from "src/raids/raid.entity";

export class WishDto
{
    @ApiProperty()
    character: number;

    @ApiProperty()
    item: number;

    @ApiProperty()
    difficulty: RaidDifficulty;
}