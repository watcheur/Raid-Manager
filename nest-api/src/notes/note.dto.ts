import { ApiProperty } from '@nestjs/swagger';

export class NoteDto {
    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly text: string;

    @ApiProperty()
    readonly favorite: boolean;
}