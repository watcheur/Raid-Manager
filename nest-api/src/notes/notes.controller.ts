import { NotesService } from './notes.service';
import { Controller, Get, Post, Put, NotFoundException, Param, Req, Res, UseGuards, Body, Query, ForbiddenException, Delete } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Note } from './note.entity';
import { NoteDto } from './note.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { TeamsService } from 'src/teams/teams.service';
import { AppGateway, SocketAction, SocketChannel } from 'src/app.gateway';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
    constructor(
        private readonly notesService: NotesService,
        private readonly teamsService: TeamsService,
        private readonly appGateway: AppGateway
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all notes' })
    @ApiQuery({ name: 'favorite', type: 'boolean', required: false })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get()
    async getAll(@Req() request: RequestWithUser, @Query('team') teamId: number, @Query('favorite') favorite: boolean): Promise<Note[]> {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        return plainToClass(Note, await this.notesService.findAll(favorite, teamId));
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given note' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Get(':id')
    async get(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number): Promise<Note> {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const note = await this.notesService.findByIdAndTeam(id, teamId);
        if (!note)
            throw new NotFoundException('Note not found');

        return plainToClass(Note, note);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create a note' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Post()
    async create(@Req() request: RequestWithUser, @Query('team') teamId: number, @Body() noteDto: NoteDto): Promise<Note>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const note = await this.notesService.save({
            ...noteDto,
            team: team.id
        });

        this.appGateway.emit(teamId, SocketChannel.Note, {
            action: SocketAction.Created,
            data: {
                note: note.id,
                ...note
            }
        })

        return plainToClass(Note, note);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update a note' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Put(':id')
    async update(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number, @Body() newValue: NoteDto): Promise<Note>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const note = await this.notesService.findByIdAndTeam(id, teamId);
        if (!note)
            throw new NotFoundException('Note not found');
        
        const newNote = await this.notesService.update(id, newValue);

        this.appGateway.emit(teamId, SocketChannel.Note, {
            action: SocketAction.Updated,
            data: {
                note: newNote.id,
                ...newNote
            }
        })

        return plainToClass(Note, newNote);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Delete a note' })
    @ApiQuery({ name: 'team', type: 'number' })
    @Delete(':id')
    async delete(@Req() request: RequestWithUser, @Query('team') teamId: number, @Param('id') id: number, @Body() newValue: NoteDto): Promise<boolean>
    {
        if (!request.user.isInTeam(teamId))
            throw new ForbiddenException("Can't request other teams events");

        const team = await this.teamsService.findById(teamId);
        if (!team)
            throw new NotFoundException("Team not found");

        const note = await this.notesService.findByIdAndTeam(id, teamId);
        if (!note)
            throw new NotFoundException('Note not found');
        
        const res = await this.notesService.delete(id);

        this.appGateway.emit(teamId, SocketChannel.Note, {
            action: SocketAction.Deleted,
            data: {
                note: note.id
            }
        })

        return res;
    }
}
