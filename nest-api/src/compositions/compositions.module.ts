import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositionsService } from './compositions.service';
import { CompositionsController } from './compositions.controller';
import { Composition } from './composition.entity';
import { CharacterComp } from './character-comp.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Composition, CharacterComp])],
    controllers: [CompositionsController],
    providers: [CompositionsService],
    exports: [CompositionsService]
})
export class CompositionsModule {}
