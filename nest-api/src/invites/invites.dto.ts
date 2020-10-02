import { ApiProperty } from '@nestjs/swagger';

export class InviteDto {
    @ApiProperty()
    readonly team: number;
}