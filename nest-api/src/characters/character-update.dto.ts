import { ApiProperty } from '@nestjs/swagger';
import { CharacterType } from './character.entity';

export class CharacterUpdateDto {
    @ApiProperty()
    readonly type: CharacterType;
}