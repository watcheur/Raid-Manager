import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Request,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete, UseInterceptors, ClassSerializerInterceptor, HttpException, Query, NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';
import { RaidsService } from './raids.service';
import { Raid } from './raid.entity';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@ApiTags('raids')
@Controller('raids')
export class RaidsController {
    constructor(
        private readonly raidsService: RaidsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all raids' })
    @Get()
    async getAll(@Request() req, @Query('expansion') expansion: number) : Promise<Raid[]>
    {
        if (expansion)
            return await this.raidsService.findByExpansion(expansion);
        return await this.raidsService.findAll();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Retrieve given raid' })
    @Get(':id')
    async get(@Request() req, @Param('id') id: number) : Promise<Raid>
    {
        let raid = await this.raidsService.findById(id);
        if (!raid)
            throw new NotFoundException('Raid not found');
        return raid;
    }
}
