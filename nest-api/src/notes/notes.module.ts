import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { AppGateway } from 'src/app.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([Note]),
        TeamsModule
    ],
    controllers: [NotesController],
    providers: [
        NotesService,
        AppGateway
    ],
    exports: [NotesService]
})
export class NotesModule {}
