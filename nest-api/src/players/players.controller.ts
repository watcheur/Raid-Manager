import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { TeamsService } from 'src/teams/teams.service';
import { PlayerUpdateDto } from './player-update.dto';
import { PlayerDto } from './player.dto';
import { Player } from './player.entity';
import { PlayersService } from './players.service';
import { AppGateway, SocketAction, SocketChannel } from 'src/app.gateway';

@ApiTags('players')
@Controller('players')
export class PlayersController {
    constructor(
        private readonly playersService: PlayersService,
        private readonly teamsService: TeamsService,
        private readonly appGateway: AppGateway
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get users by team' })
    @ApiQuery({ name: 'team' })
    @Get()
    async getAll(@Request() req: RequestWithUser, @Query('team') teamId: number): Promise<Player[]>
    {
        if (!teamId)
            throw new BadRequestException('No team provided');

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException('Team not found');
        
        if (!req.user.isInTeam(team.id))
            throw new ForbiddenException("You can't request another team's players")
        
        return await this.playersService.findByTeam(teamId);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given player' })
    @Get(':id')
    async get(@Request() req: RequestWithUser, @Param('id') playerId: number): Promise<Player | null>
    {
        const player = await this.playersService.findById(playerId);
        if (!player)
            throw new NotFoundException('Player not found');

        if (!req.user.isInTeam(player.team.id))
            throw new BadRequestException("You can't request another team's player");

        return player;
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create a player for a team' })
    @Post()
    async create(@Request() req: RequestWithUser, @Body() playerDto: PlayerDto): Promise<Player> {
        const team = await this.teamsService.findById(playerDto.team);
        if (!team)
            throw new NotFoundException("Team not found");
        
        if (!req.user.isInTeam(team.id))
            throw new ForbiddenException("You can't request player to other teams");

        const player = await this.playersService.create(playerDto, team);

        this.appGateway.emit(team.id, SocketChannel.Player, {
            action: SocketAction.Created,
            data: {
                player: player.id,
                ...player
            }
        })
        
        return plainToClass(Player, player);
   }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update a given player' })
    @Put(':id')
    async update(@Request() req: RequestWithUser, @Param('id') id: number, @Body() playerDto: PlayerUpdateDto): Promise<Player> {
        const player = await this.playersService.findById(id);
        if (!player)
            throw new NotFoundException("Player not found");

        if (!req.user.isInTeam(player.team.id))
            throw new ForbiddenException("You can't update other teams player");

        const updated = await this.playersService.update(id, playerDto);

        this.appGateway.emit(player.team.id, SocketChannel.Player, {
            action: SocketAction.Updated,
            data: {
                player: player.id,
                ...player
            }
        })
        
        return plainToClass(Player, updated);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Delete a player' })
    @Delete(':id')
    async delete(@Request() req: RequestWithUser, @Param('id') id: number): Promise<boolean> {
        const player = await this.playersService.findById(id);
        if (!player)
            throw new NotFoundException("Player not found");

        if (!req.user.isInTeam(player.team.id))
            throw new ForbiddenException("You can't update other teams player");

        const res = await this.playersService.delete(id);

        this.appGateway.emit(player.team.id, SocketChannel.Player, {
            action: SocketAction.Deleted,
            data: {
                player: player.id,
                ...player
            }
        })
        
        return res;
    }
}
