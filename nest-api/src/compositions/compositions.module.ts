import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositionsService } from './compositions.service';
import { CompositionsController } from './compositions.controller';
import { Composition } from './composition.entity';
import { CharacterComp } from './character-comp.entity';
import { NotesModule } from 'src/notes/notes.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Composition, CharacterComp]),
        NotesModule
    ],
    controllers: [CompositionsController],
    providers: [CompositionsService],
    exports: [CompositionsService]
})
export class CompositionsModule {}
