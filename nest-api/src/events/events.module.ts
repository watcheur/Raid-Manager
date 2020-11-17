import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositionsModule } from 'src/compositions/compositions.module';
import { CompositionsService } from 'src/compositions/compositions.service';
import { EncountersModule } from 'src/encounters/encounters.module';
import { RaidsModule } from 'src/raids/raids.module';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
	imports: [TypeOrmModule.forFeature([Event]), CompositionsModule, RaidsModule, EncountersModule],
	controllers: [EventsController],
	providers: [EventsService],
	exports: [EventsService]
})
export class EventsModule {}
