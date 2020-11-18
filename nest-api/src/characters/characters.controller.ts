import { Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { Character } from './character.entity';
import { CharacterDto } from './character.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { RealmsService } from 'src/realms/realms.service';
import { PlayersService } from 'src/players/players.service';
import { CharacterUpdateDto } from './character-update.dto';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
    constructor(
        private readonly charactersService: CharactersService,
        private readonly blizzardService: BlizzardService,
        private readonly realmsService: RealmsService,
        private readonly playersService: PlayersService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all characters' })
    @Get()
    async getAll(): Promise<Character[]>
    {
        return plainToClass(Character, await this.charactersService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get a given character' })
    @Get()
    async get(@Param('id') id: number)
    {
        return plainToClass(Character, await this.charactersService.findById(id));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Add a new character' })
    @Post()
    async create(@Req() request: RequestWithUser, @Body() body: CharacterDto)
    {
        const realm = await this.realmsService.findById(body.realm);
        if (!realm)
            throw new NotFoundException("Realm not found");
        
        const player = await this.playersService.findById(body.player);
        if (!player)
            throw new NotFoundException("Player not found");

        try {
            const blizzardCharacter = await this.blizzardService.Character("", {
                realm: realm.slug,
                name: body.name.toLowerCase()
            });

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

            // Todo equipment, weekly queue

            return character;
        }
        catch (error)
        {
            if (error?.isAxiosError)
                throw new HttpException(error.response.statusText, error.response.status)
            throw new InternalServerErrorException(error.message);
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update a character' })
    @Put(':id')
    async update(@Req() request: RequestWithUser, @Param('id') id: number, @Body() body: CharacterUpdateDto)
    {
        const character = await this.charactersService.findById(id);
        if (!character)
            throw new NotFoundException("Character not found");

        const res = await this.charactersService.update(id, {
            type: body.type
        })

        return res;
    }
}
