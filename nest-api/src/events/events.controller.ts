import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { CompositionsService } from 'src/compositions/compositions.service';
import { EventsService } from './events.service';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventDto } from './event.dto';
import { RaidsService } from 'src/raids/raids.service';
import { EventDuplicateDto } from './event-duplicate.dto';
import { EncountersService } from 'src/encounters/encounters.service';
import { CharacterComp } from 'src/compositions/character-comp.entity';
import { CharacterCompDto } from 'src/compositions/character-comp.dto';
import { CompositionDto } from 'src/compositions/composition.dto';
import { Event } from './event.entity';
import { CharactersService } from 'src/characters/characters.service';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { TeamsService } from 'src/teams/teams.service';
import { AppGateway, SocketAction, SocketChannel } from 'src/app.gateway';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly compositionsService: CompositionsService,
        private readonly encountersService: EncountersService,
        private readonly raidsService: RaidsService,
        private readonly charactersService: CharactersService,
        private readonly teamsService: TeamsService,
        private readonly appGateway: AppGateway
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all events' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get()
    async getAll(@Req() request: RequestWithUser, @Query('team') teamId: number): Promise<Event[]>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        return plainToClass(Event, await this.eventsService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get next scheduled event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get('next')
    async getNext(@Req() request: RequestWithUser, @Query('team') teamId: number): Promise<Event | null>
    {
        if (!request.user.isInTeam(teamId))
        throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");
            
        const nextEvent = await this.eventsService.findNextTeamEvent(teamId);
        if (!nextEvent)
            throw new NotFoundException('No next event scheduled');
        return plainToClass(Event, nextEvent);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get(':id')
    async get(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number): Promise<Event | null>
    {
        if (!request.user.isInTeam(teamId))
        throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const event = await this.eventsService.findByIdAndTeam(id, teamId);
        if (!event)
            throw new NotFoundException('Event not found');
        return plainToClass(Event, event);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Duplicate event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Post(':id/duplicate')
    async duplicate(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number, @Body() body: EventDuplicateDto): Promise<Event | null>
    {
        if (!request.user.isInTeam(teamId))
        throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");


        const event = await this.eventsService.findByIdAndTeam(id, teamId);
        if (!event)
            throw new NotFoundException('Event not found');
        const newEvent = await this.eventsService.duplicate(id, body.date);

        this.appGateway.emit(teamId, SocketChannel.Event, {
            action: SocketAction.Created,
            data: {
                event: newEvent.id,
                ...newEvent
            }
        })

        return plainToClass(Event, newEvent);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all comp for a given event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get(':id/compositions')
    async getCompForEvent(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number)
    {
        if (!request.user.isInTeam(teamId))
        throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const event = await this.eventsService.findByIdAndTeam(id, teamId);
        if (!event)
            throw new NotFoundException('Event not found');
        
        return await this.compositionsService.findByEvent(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: "Get comp for given event's encounter" })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get(':id/compositions/:encounter')
    async getCompForEventEncounter(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number, @Param('encounter') encounterId: number)
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");
        
        const encounter = await this.encountersService.findById(encounterId);
        if (!encounter)
            throw new NotFoundException("Encounter not found");
        
        const event = await this.compositionsService.findByEventAndEncounter(id, encounterId);
        if (!event)
            throw new NotFoundException("Event with this encounter not found");
        
        return event;
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: "Create comp for a given event's encounter"})
    @ApiQuery({ name: 'team', type: 'number' })
    @Post(':id/compositions/:encounter')
    async createCompForEventEncounter(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') eventId: number, @Param('encounter') encounterId: number, @Body() body: CompositionDto)
    {
        if (!request.user.isInTeam(teamId))
        throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const event = await this.eventsService.findByIdAndTeam(eventId, teamId);
        if (!event)
            throw new NotFoundException('Event not found');

        const encounter = await this.encountersService.findById(encounterId);
        if (!encounter)
            throw new NotFoundException('Encounter not found');

        if (body.characters)
        {
            const charactersIds = body.characters.map(c => c.characterId);
            const characters = await this.charactersService.findByIds(charactersIds);
            if (characters.length != charactersIds.length)
                throw new NotFoundException("Some characters weren't found");
        }
        
        const res = await this.compositionsService.save(eventId, encounterId, body);

        this.appGateway.emit(teamId, SocketChannel.Composition, {
            action: SocketAction.Created,
            data: {
                event: eventId,
                encounter: encounter.id
            }
        })

        return res;
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create an event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Post()
    async create(@Req() request: RequestWithUser, @Query('team') teamId: number, @Body() body: EventDto): Promise<Event>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const raid = await this.raidsService.findById(body.raid);
        if (!raid)
            throw new NotFoundException('Raid not found');

        const event = await this.eventsService.create(body, teamId);

        this.appGateway.emit(teamId, SocketChannel.Event, {
            action: SocketAction.Created,
            data: event
        })

        return plainToClass(Event, event);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update an event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Put(':id')
    async update(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number, @Body() body: EventDto): Promise<Event>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");
        
        const event = await this.eventsService.findByIdAndTeam(id, teamId);
        if (!event)
            throw new NotFoundException('Event not found');

        if (body.raid) {
            const raid = await this.raidsService.findById(body.raid);
            if (!raid)
                throw new NotFoundException('Raid not found');
        }

        const updatedEvent = await this.eventsService.update(id, body);

        this.appGateway.emit(teamId, SocketChannel.Event, {
            action: SocketAction.Updated,
            data: updatedEvent
        })

        return plainToClass(Event, updatedEvent);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Delete a given event' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Delete(':id')
    async delete(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number): Promise<boolean>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const event = await this.eventsService.findByIdAndTeam(id, teamId);
        if (!event)
            throw new NotFoundException('Event not found');
        const res = await this.eventsService.delete(id);

        if (res)
        {
            this.appGateway.emit(teamId, SocketChannel.Event, {
                action: SocketAction.Deleted,
                data: {
                    event: event.id
                }
            })
        }

        return res;
    }
}
