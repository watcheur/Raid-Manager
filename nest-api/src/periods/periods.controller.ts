import { Controller, Param, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Period } from './period.entity';
import { PeriodsService } from './periods.service';

@Controller('periods')
export class PeriodsController {
    constructor(
        private readonly periodsService: PeriodsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Retrieve all periods' })
    @Get()
    async getAll() : Promise<Period[]>
    {
        return plainToClass(Period, await this.periodsService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Retrieve given period' })
    @Get(':id')
    async get(@Param('id') id: number) : Promise<Period | null>
    {
        const period = this.periodsService.findById(id);
        if (!period)
            throw new NotFoundException('Period not found');
        
        return plainToClass(Period, period);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get current period' })
    @Get('current')
    async current(): Promise<Period>
    {
        return plainToClass(Period, await this.periodsService.findCurrent());
    }
}
