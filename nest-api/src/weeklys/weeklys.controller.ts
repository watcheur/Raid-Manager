import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { WeeklysService } from './weeklys.service';
import { ApiOperation } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Weekly } from './weekly.entity';

@Controller('weeklys')
export class WeeklysController {
    constructor(
        private readonly weeklysService: WeeklysService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all weekly' })
    @Get()
    async getAll(): Promise<Weekly[]>
    {
        return plainToClass(Weekly, await this.weeklysService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given weekly' })
    @Get(':id')
    async get(@Param('id') id: number): Promise<Weekly | null>
    {
        const weekly = await this.weeklysService.findById(id);
        if (!weekly)
            throw new NotFoundException('Weekly not found');
        
        return plainToClass(Weekly, weekly);
    }
}
