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
    HttpException, NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { AuthGuard } from '@nestjs/passport';
import { TeamDto } from './teams.dto';
import { Team } from './team.entity';
import { classToPlain, plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
    constructor(
        private readonly teamsService: TeamsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return teams for logged user' })
    @Get()
    async getAll(@Request() req): Promise<Team[]> {
        return plainToClass(Team, await this.teamsService.findByUser(req.user));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return teams for logged user' })
    @Get(':id')
    async get(@Request() req, @Param('id') id: number): Promise<Team | null> {
        let team = await this.teamsService.findById(id);
        if (!team)
            throw new NotFoundException('Team not found');

        if (team.users.findIndex(u => u.id == req.user.id) == -1)
            throw new NotFoundException('Team not found');

        return plainToClass(Team, team);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create a Team with current user as founder' })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async create(@Request() req, @Body() teamDto: TeamDto): Promise<Team> {
        return plainToClass(Team, await this.teamsService.create(teamDto, req.user));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update a team' })
    @Put(':id')
    async update(@Request() req, @Param('id') id: number, @Body() teamDto: TeamDto): Promise<Team> {
        return plainToClass(Team, await this.teamsService.update(id, teamDto));
    }
}