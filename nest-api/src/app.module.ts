import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { EncountersService } from './encounters/encounters.service';
import { EncountersController } from './encounters/encounters.controller';
import { EncountersModule } from './encounters/encounters.module';
import { ItemsService } from './items/items.service';
import { ItemsModule } from './items/items.module';

@Module({
	imports: [TypeOrmModule.forRoot(), AuthModule, UsersModule, RealmsModule, TeamsModule, InvitesModule, RaidsModule, ExpansionsModule, EncountersModule, ItemsModule],
	controllers: [AppController, EncountersController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor
		},
		EncountersService,
		ItemsService
	],
})
export class AppModule {}