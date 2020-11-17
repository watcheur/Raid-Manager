import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RealmsModule } from './realms/realms.module';
import { TeamsModule } from './teams/teams.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { InvitesModule } from './invites/invites.module';
import { RaidsModule } from './raids/raids.module';
import { ExpansionsModule } from './expansions/expansions.module';
import { EncountersModule } from './encounters/encounters.module';
import { ItemsModule } from './items/items.module';
import { AppGateway } from './app.gateway';
import { PlayersModule } from './players/players.module';
import { CharactersModule } from './characters/characters.module';
import { WeeklysModule } from './weeklys/weeklys.module';
import { PeriodsModule } from './periods/periods.module';
import { BlizzardModule } from './blizzard/blizzard.module';
import { SeasonsModule } from './seasons/seasons.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { EventsModule } from './events/events.module';
import { NotesModule } from './notes/notes.module';
import { CompositionsModule } from './compositions/compositions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				// JWT Configuration
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_TIME: Joi.string().required(),
				JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
				JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

				// SERVER Configuration
				SERVER_PORT: Joi.string().required(),

				// BLIZZARD Configuration
				BLIZZARD_KEY: Joi.string().required(),
				BLIZZARD_SECRET: Joi.string().required(),
				BLIZZARD_ORIGIN: Joi.string().optional(),
				BLIZZARD_LOCALE: Joi.string().optional()
			})
		}),
		ScheduleModule.forRoot(),
		TypeOrmModule.forRoot(),
		AuthModule,
		UsersModule,
		RealmsModule,
		TeamsModule,
		InvitesModule,
		RaidsModule,
		ExpansionsModule,
		EncountersModule,
		ItemsModule,
		PlayersModule,
		CharactersModule,
		PeriodsModule,
		SeasonsModule,
		WeeklysModule,
		BlizzardModule,
		WishlistsModule,
		EventsModule,
		NotesModule,
		CompositionsModule,
		TasksModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor
		},
		AppGateway
	],
})
export class AppModule {}