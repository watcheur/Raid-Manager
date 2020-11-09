import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Encounter } from './encounter.entity';
import { EncountersService } from './encounters.service';

@ApiTags('encounters')
@Controller('encounters')
export class EncountersController {
    constructor(
        private readonly encountersService: EncountersService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all encounters' })
    @Get()
    async getAll() : Promise<Encounter[]>
    {
        return await this.encountersService.findAll();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given encounter' })
    @Get(':id')
    async get(@Param('id') id: number) : Promise<Encounter | null>
    {
        let encounter = await this.encountersService.findById(id);
        if (!encounter)
            throw new NotFoundException('Encounter not found');
        return encounter;
    }
}