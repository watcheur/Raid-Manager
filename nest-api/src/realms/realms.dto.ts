import { ApiProperty } from '@nestjs/swagger';

export class RealmDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly category: string;
}