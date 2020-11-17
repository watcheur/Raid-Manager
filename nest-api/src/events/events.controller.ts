import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { CompositionsService } from 'src/compositions/compositions.service';
import { EventsService } from './events.service';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventDto } from './event.dto';
import { RaidsService } from 'src/raids/raids.service';
import { EventDuplicateDto } from './event-duplicate.dto';
import { EncountersService } from 'src/encounters/encounters.service';
import { CharacterComp } from 'src/compositions/character-comp.entity';
import { CharacterCompDto } from 'src/compositions/character-comp.dto';
import { CompositionDto } from 'src/compositions/composition.dto';
import { Event } from './event.entity';
import { CharactersService } from 'src/characters/characters.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly compositionsService: CompositionsService,
        private readonly encountersService: EncountersService,
        private readonly raidsService: RaidsService,
        private readonly charactersService: CharactersService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all events' })
    @Get()
    async getAll(): Promise<Event[]>
    {
        return plainToClass(Event, await this.eventsService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get next scheduled event' })
    @Get('next')
    async getNext(): Promise<Event | null>
    {
        const nextEvent = await this.eventsService.findNext();
        if (!nextEvent)
            throw new NotFoundException('No next event scheduled');
        return plainToClass(Event, nextEvent);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given event' })
    @Get(':id')
    async get(@Param('id') id: number): Promise<Event | null>
    {
        const event = await this.eventsService.findById(id);
        if (!event)
            throw new NotFoundException('Event not found');
        return plainToClass(Event, event);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given event' })
    @Post(':id/duplicate')
    async duplicate(@Param('id') id: number, @Body() body: EventDuplicateDto): Promise<Event | null>
    {
        const event = await this.eventsService.findById(id);
        if (!event)
            throw new NotFoundException('Event not found');
        return plainToClass(Event, await this.eventsService.duplicate(id, body.date));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all comp for a given event' })
    @Get(':id/compositions')
    async getCompForEvent(@Param('id') id: number)
    {
        const event = this.eventsService.findById(id);
        if (!event)
            throw new NotFoundException('Event not found');
        
        return this.compositionsService.findByEvent(id);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: "Get comp for given event's encounter" })
    @Get(':id/compositions/:encounter')
    async getCompForEventEncounter(@Param('id') id: number, @Param('encounter') encounter: number)
    {
        const event = this.eventsService.findById(id);
        if (!event)
            throw new NotFoundException('Event not found');
        
        return this.compositionsService.findByEventAndEncounter(id, encounter);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: "Create comp for a given event's encounter"})
    @Post(':id/compositions/:encounter')
    async createCompForEventEncounter(@Param('id') eventId: number, @Param('encounter') encounterId: number, @Body() body: CompositionDto)
    {
        const event = await this.eventsService.findById(eventId);
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
        
        return this.compositionsService.create(eventId, encounterId, body);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create an event' })
    @Post()
    async create(@Body() body: EventDto): Promise<Event>
    {
        const raid = await this.raidsService.findById(body.raid);
        if (!raid)
            throw new NotFoundException('Raid not found');

        return plainToClass(Event, await this.eventsService.create(body));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update an event' })
    @Put('id')
    async update(@Param('id') id: number, @Body() body: EventDto): Promise<Event>
    {
        const event = await this.eventsService.findById(id);
        if (!event)
            throw new NotFoundException('Event not found');

        if (body.raid) {
            const raid = await this.raidsService.findById(body.raid);
            if (!raid)
                throw new NotFoundException('Raid not found');
        }

        return plainToClass(Event, await this.eventsService.update(id, body));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Delete a given event' })
    @Delete('id')
    async delete(@Param('id') id: number): Promise<boolean>
    {
        const event = await this.eventsService.findById(id);
        if (!event)
            throw new NotFoundException('Event not found');
        return await this.eventsService.delete(id);
    }
}
