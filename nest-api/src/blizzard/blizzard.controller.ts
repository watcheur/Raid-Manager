import { Controller, Get, NotFoundException, Param, Query, Res, UseGuards } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { BlizzardService } from './blizzard.service';

@ApiTags('blizzard')
@Controller('blizzard')
export class BlizzardController {
    constructor(
        private readonly blizzardService: BlizzardService,
        private readonly schedulerRegistry: SchedulerRegistry
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Test blizzard API return for given character' })
    @Get('/character/:realm/:name')
    async getCharacter(@Param('realm') realm: string, @Param('name') name: string)
    {
        return this.blizzardService.Character("", {
            realm: realm,
            name: name
        })             
    }
    
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Test blizzard API return <option> for given character' })
    @ApiParam({ name: 'option', enum: ["equipment", "encounter", "collections", "appearance", "achievements", "professions", "quests", "reputations", "specializations", "titles", "statistics", "mythic-keystone-profile"] })
    @Get('/character/:realm/:name/:option')
    async getCharacterEquipment(@Param('realm') realm: string, @Param('name') name: string, @Param('option') option: string)
    {
        return this.blizzardService.Character(option, {
            realm: realm,
            name: name
        })
    }

    //@UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Retrieve all realms' })
    @ApiQuery({ name: 'refresh', required: false })
    @Get('/realms')
    async getRealms(@Query('refresh') refresh: boolean)
    {
        if (refresh)
        {
            const job = this.schedulerRegistry.getCronJob('realms');
            console.log("job", job);
            if (job)
                job.start();
        }

        return [];

        return this.blizzardService.GetRealms();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Retrieve all expansions' })
    @Get('/expansions')
    async getExpansions()
    {
        return this.blizzardService.GetExpansions();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get expansion info' })
    @Get('/expansions/:id')
    async getExpansion(@Param('id') id: number)
    {
        return this.blizzardService.GetExpansion(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get instances' })
    @Get('/instances')
    async getInstances()
    {
        return this.blizzardService.GetInstances();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get instance info' })
    @Get('/instances/:id')
    async getInstance(@Param('id') id: number)
    {
        return this.blizzardService.GetInstance(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get encounters' })
    @Get('/encounters')
    async getEncounters()
    {
        return this.blizzardService.GetEncounters();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get encounter info' })
    @Get('/encounters/:id')
    async getEncounter(@Param('id') id: number)
    {
        return this.blizzardService.GetEncounter(id);
    }

    @ApiOperation({ summary: 'Get mythic keystone seasons' })
    @Get('/mythic-keystone/seasons')
    async getMythicKeystoneSeasons()
    {
        return this.blizzardService.GetMythicKeystoneSeasons();
    }

    @ApiOperation({ summary: 'Get mythic keystone seasons' })
    @Get('/mythic-keystone/seasons/:id')
    async getMythicKeystoneSeason(@Param('id') id: number)
    {
        return this.blizzardService.GetMythicKeystoneSeason(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get mythic keystone periods' })
    @Get('/mythic-keystone/period')
    async getMythicKeystonePeriods()
    {
        return this.blizzardService.GetMythicKeystoneSeasons();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get mythic keystone period' })
    @Get('/mythic-keystone/period/:id')
    async getMythicKeystonePeriod(@Param('id') id: number)
    {
        return this.blizzardService.GetMythicKeystoneSeason(id);
    }
}
