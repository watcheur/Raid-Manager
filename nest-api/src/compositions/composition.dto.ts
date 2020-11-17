import { ApiProperty } from '@nestjs/swagger';
import { NoteDto } from 'src/notes/note.dto';
import { CharacterCompDto } from './character-comp.dto';

export class CompositionDto {
    /*
    @ApiProperty()
    readonly event: number;

    @ApiProperty()
    readonly encounter: number;
    */

    @ApiProperty({ required: false })
    readonly note: NoteDto;

    @ApiProperty({ type: () => [CharacterCompDto], required: false })
    readonly characters: CharacterCompDto[];
}