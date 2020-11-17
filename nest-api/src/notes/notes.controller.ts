import { NotesService } from './notes.service';
import { Controller, Get, Post, Put, NotFoundException, Param, Res, UseGuards, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Note } from './note.entity';
import { NoteDto } from './note.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
    constructor(
        private readonly notesService: NotesService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all notes' })
    @ApiQuery({ name: 'favorite', type: 'boolean', required: false })
    @Get()
    async getAll(@Query('favorite') favorite: boolean): Promise<Note[]> {
        return plainToClass(Note, await this.notesService.findAll(favorite));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given note' })
    @Get(':id')
    async get(@Param('id') id: number): Promise<Note> {
        const note = await this.notesService.findById(id);
        if (!note)
            throw new NotFoundException('Note not found');

        return plainToClass(Note, note);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create a note' })
    @Post()
    async create(@Body() note: NoteDto): Promise<Note>
    {
        return await this.notesService.create(note);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update a note' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() newValue: NoteDto): Promise<Note>
    {
        const note = await this.notesService.findById(id);
        if (!note)
            throw new NotFoundException('Note not found');
        
        return await this.notesService.update(id, newValue);
    }

    
}
