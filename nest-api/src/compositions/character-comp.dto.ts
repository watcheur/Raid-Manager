import { Character, Role } from "src/characters/character.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CharacterCompDto
{
    @ApiProperty()
    role: Role;

    @ApiProperty()
    characterId: number;
}