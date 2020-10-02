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
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpException,
    Query
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';
import { ExpansionsService } from './expansions.service';
import { Expansion } from './expansion.entity';
import { get } from 'http';

@ApiTags('expansions')
@Controller('expansions')
export class ExpansionsController {
    constructor(
        private readonly expansionsService: ExpansionsService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get all expansions' })
    @Get()
    async getAll(@Request() req) : Promise<Expansion[]>
    {
        return await this.expansionsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Retrieve given expansion' })
    @Get(':id')
    async get(@Request() req, @Param('id') id: number) : Promise<Expansion>
    {
        let expansion = await this.expansionsService.findById(id);
        if (!expansion)
            throw new HttpException('Expansion not found', HttpStatus.NOT_FOUND);
        return expansion;
    }
}