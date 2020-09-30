import { ApiProperty } from '@nestjs/swagger';

export class TeamDto {
    @ApiProperty()
    readonly name: string;
}