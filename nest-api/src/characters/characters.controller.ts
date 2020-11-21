import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { Character } from './character.entity';
import { CharacterDto } from './character.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { RealmsService } from 'src/realms/realms.service';
import { PlayersService } from 'src/players/players.service';
import { CharacterUpdateDto } from './character-update.dto';
import { TeamsService } from 'src/teams/teams.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WeeklysService } from 'src/weeklys/weeklys.service';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
    constructor(
        private readonly charactersService: CharactersService,
        private readonly blizzardService: BlizzardService,
        private readonly realmsService: RealmsService,
        private readonly playersService: PlayersService,
        private readonly teamsService: TeamsService,
        private readonly weeklyService: WeeklysService,
        
        @InjectQueue('character') private characterQueue: Queue,
        @InjectQueue('character-items') private characterItemsQueue: Queue,
        @InjectQueue('character-weeklys') private characterWeeklysQueue: Queue,
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all characters' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get()
    async getAll(@Req() request: RequestWithUser, @Query('team') teamId: number): Promise<Character[]>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request another team characters");
            
        return plainToClass(Character, await this.charactersService.findByTeam(teamId));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get a given character' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get(':id')
    async get(@Req() request: RequestWithUser, @Param('id') id: number, @Query('team') teamId: number)
    {
        if (!request.user.isInTeam(teamId))
        throw new ForbiddenException("Can't request another team character");

        return plainToClass(Character, await this.charactersService.findByIdAndTeam(id, teamId));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Add a new character to a team' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Post()
    async create(@Req() request: RequestWithUser, @Body() body: CharacterDto, @Query('team') teamId: number)
    {
        const realm = await this.realmsService.findById(body.realm);
        if (!realm)
            throw new NotFoundException("Realm not found");
        
        const player = await this.playersService.findById(body.player);
        if (!player)
            throw new NotFoundException("Player not found");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");
        
        if (!request.user.isInTeam(team.id))
            throw new ForbiddenException("You can't add character to another team");

        try {
            const blizzardCharacter = await this.blizzardService.Character("", {
                realm: realm.slug,
                name: body.name.toLowerCase()
            });

            if (team.characters.map(c => c.id).indexOf(blizzardCharacter.id) >= 0)
                throw new BadRequestException("Character is already in this team");

            const character = await this.charactersService.saveRaw({
                id: blizzardCharacter.id,
                name: blizzardCharacter.name,
                realmId: blizzardCharacter.realm.id,
                playerId: body.player,
                type: body.type,
                level: blizzardCharacter.level,
                race: blizzardCharacter.race.id,
                gender: blizzardCharacter.gender.type,
                faction: blizzardCharacter.faction.type,
                class: blizzardCharacter.character_class.id,
                spec: blizzardCharacter.active_spec.id || 0,
                avg: blizzardCharacter.average_item_level,
                equipped: blizzardCharacter.equipped_item_level
            });

            if (!team.characters || team.characters.map(c => c.id).indexOf(character.id) <= 0) {
                team.characters.push(character);
                this.teamsService.save(team);

                // This is a new character, add him to queue
                this.characterItemsQueue.add({ character: character.id });
                this.characterWeeklysQueue.add({ character: character.id });
            }

            return character;
        }
        catch (error)
        {
            if (error?.isAxiosError)
                throw new HttpException(error.response.statusText, error.response.status)
            if (error instanceof HttpException)
                throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update a character' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Put(':id')
    async update(@Req() request: RequestWithUser, @Param('id') id: number, @Query('team') teamId: number, @Body() body: CharacterUpdateDto)
    {
        const character = await this.charactersService.findById(id);
        if (!character)
            throw new NotFoundException("Character not found");
        
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("You can't update another team character");

        const res = await this.charactersService.update(id, {
            type: body.type
        })

        return res;
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Remove a character' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Delete(':id')
    async delete(@Req() request: RequestWithUser, @Param('id') id: number, @Query('team') teamId: number)
    {
        const character = await this.charactersService.findById(id);
        if (!character)
            throw new NotFoundException("Character not found");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found")

        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("You can't delete another team's character");
        
        if (team.characters.map(c => c.id).indexOf(character.id) < 0)
            throw new BadRequestException("This character isn't part of this team");
        
        team.characters = team.characters.filter(c => c.id != character.id)
        await this.teamsService.save(team);

        if (character.teams.filter(t => t.id != team.id).length == 0)
            await this.charactersService.delete(character.id);
        
        return true;
    }
}
