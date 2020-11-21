import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ){}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force realms refresh' })
    @Get('/realms')
    realms()
    {
        return this.tasksService.realmsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force expansions refresh' })
    @Get('/expansions')
    expansions()
    {
        return this.tasksService.expansionsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force raids refresh' })
    @Get('/raids')
    raids()
    {
        return this.tasksService.raidsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force encounters refresh - from database raids' })
    @Get('/encounters')
    encounters()
    {
        return this.tasksService.encountersRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force seasons refresh' })
    @Get('/seasons')
    seasons()
    {
        return this.tasksService.seasonsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force periods refresh' })
    @Get('/periods')
    periods()
    {
        return this.tasksService.periodsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force characters refresh' })
    @Get('/characers')
    characters()
    {
        return this.tasksService.charactersRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force characters items refresh' })
    @Get('/characters/items')
    charactersItems()
    {
        return this.tasksService.charactersItemsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force characters weeklys refresh' })
    @Get('/characters/weeklys')
    charactersWeeklys()
    {
        return this.tasksService.charactersWeeklysRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force refresh weekly, items & character information for a given id' })
    @Get('/character/:id')
    character(@Param('id') id: number)
    {
        return this.tasksService.characterRefresh(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force refresh all items without datas' })
    @Get('/items')
    items()
    {
        return this.tasksService.itemsRefresh();
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force refresh given item data' })
    @Get('/items/:id')
    item(@Param('id') id: number)
    {
        return this.tasksService.itemRefresh(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Force refresh all items without media' })
    @Get('/items/medias')
    itemsMedia()
    {
        return this.tasksService.itemsMediaRefresh();
    }
}
