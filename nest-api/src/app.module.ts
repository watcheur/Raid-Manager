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
import { InvitesService } from './invites/invites.service';
import { InvitesModule } from './invites/invites.module';
import { TeamsService } from './teams/teams.service';
import { UsersService } from './users/users.service';
import { RealmsService } from './realms/realms.service';

@Module({
	imports: [TypeOrmModule.forRoot(), AuthModule, UsersModule, RealmsModule, TeamsModule, InvitesModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor
		}
	],
})
export class AppModule {}