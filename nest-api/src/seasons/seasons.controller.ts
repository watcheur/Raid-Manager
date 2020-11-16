import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Season } from './season.entity';
import { SeasonsService } from './seasons.service';

@ApiTags('seasons')
@Controller('seasons')
export class SeasonsController {
    constructor(
        private readonly seasonsService: SeasonsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all seasons' })
    @Get()
    async getAll(): Promise<Season[]>
    {
        return plainToClass(Season, await this.seasonsService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given season' })
    @Get(':id')
    async get(@Param('id') id: number): Promise<Season>
    {
        return plainToClass(Season, await this.seasonsService.findById(id));
    }
}
