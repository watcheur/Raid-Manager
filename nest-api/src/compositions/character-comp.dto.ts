import { ApiProperty } from '@nestjs/swagger';
import { Role } from "src/characters/enums";

export class CharacterCompDto
{
    @ApiProperty()
    role: Role;

    @ApiProperty()
    characterId: number;
}