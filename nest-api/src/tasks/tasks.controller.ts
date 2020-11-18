import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
