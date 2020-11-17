import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { CompositionsService } from 'src/compositions/compositions.service';
import { EventsService } from './events.service';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventDto } from './event.dto';
import { RaidsService } from 'src/raids/raids.service';
import { EventDuplicateDto } from './event-duplicate.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly compositionsService: CompositionsService,
        private readonly raidsService: RaidsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all events' })
    @Get()
    async getAll(): Promise<Event[]>
    {
        return plainToClass(Event, await this.eventsService.findAll());
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

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get next scheduled event' })
    @Get('next')
    async getNext(): Promise<Event | null>
    {
        return plainToClass(Event, await this.eventsService.findNext());
    }
}
