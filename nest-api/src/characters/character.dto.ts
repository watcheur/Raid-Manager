import { ApiProperty } from '@nestjs/swagger';
import { CharacterType } from './enums';

export class CharacterDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly realm: number;

    @ApiProperty()
    readonly type: CharacterType;

    @ApiProperty()
    readonly player?: number;
}