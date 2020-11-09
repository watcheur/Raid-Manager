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
import * as Joi from 'joi';
import { AppGateway } from './app.gateway';

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
				SERVER_PORT: Joi.string().required()
			})
		}),
		TypeOrmModule.forRoot(),
		AuthModule,
		UsersModule,
		RealmsModule,
		TeamsModule,
		InvitesModule,
		RaidsModule,
		ExpansionsModule,
		EncountersModule,
		ItemsModule
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