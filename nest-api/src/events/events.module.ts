import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { AppModule } from 'src/app.module';
import { CharactersModule } from 'src/characters/characters.module';
import { CompositionsModule } from 'src/compositions/compositions.module';
import { CompositionsService } from 'src/compositions/compositions.service';
import { EncountersModule } from 'src/encounters/encounters.module';
import { RaidsModule } from 'src/raids/raids.module';
import { TeamsModule } from 'src/teams/teams.module';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Event]),
		CompositionsModule,
		RaidsModule,
		EncountersModule,
		CharactersModule,
		TeamsModule
	],
	controllers: [EventsController],
	providers: [
		EventsService,
		AppGateway
	],
	exports: [EventsService]
})
export class EventsModule {}
