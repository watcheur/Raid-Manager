import { Controller, Get, Post, Put, NotFoundException, Param, Req, Res, UseGuards, Body, Query, ForbiddenException, Delete } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { OptionsService } from './options.service';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { TeamsService } from 'src/teams/teams.service';
import { OptionDto } from './option.dto';
import { Option } from './option.entity';

@ApiTags('options')
@Controller('options')
export class OptionsController {
    constructor(
        private readonly optionsService: OptionsService,
        private readonly teamsService: TeamsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all options' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get()
    async getAll(@Req() request: RequestWithUser, @Query('team') teamId: number)
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        return plainToClass(Option, await this.optionsService.findAll(teamId));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given option' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get(':key')
    async get(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('key') key: string)
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        return plainToClass(Option, await this.optionsService.findByKey(key, teamId));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create an option' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Post()
    async create(
        @Req() request: RequestWithUser,
        @Query('team') teamId: number,
        @Body() body: OptionDto
    )
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        return plainToClass(Option, await this.optionsService.save(teamId, body));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update given option' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Put(':key')
    async update(
        @Req() request: RequestWithUser,
        @Query('team') teamId: number,
        @Param('key') key: string,
        @Body() body: OptionDto
    )
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");
        
        const option = await this.optionsService.findByKey(key, teamId);
        if (!option)
            throw new NotFoundException("Option not found");

        return plainToClass(Option, await this.optionsService.update(option.id, body));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update given option' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Delete(':key')
    async delete(
        @Req() request: RequestWithUser,
        @Query('team') teamId: number,
        @Param('key') key: string
    )
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");
        
        const option = await this.optionsService.findByKey(key, teamId);
        if (!option)
            throw new NotFoundException("Option not found");

        return await this.optionsService.delete(option.id);
    }
}
