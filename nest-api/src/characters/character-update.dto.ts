import { ApiProperty } from '@nestjs/swagger';
import { CharacterType } from './enums';

export class CharacterUpdateDto {
    @ApiProperty()
    readonly type: CharacterType;
}