import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { TeamsModule } from 'src/teams/teams.module';
import { Option } from './option.entity';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Option]),
		TeamsModule
	],
	controllers: [OptionsController],
	providers: [
		OptionsService,
		AppGateway
	],
	exports: [OptionsService]
})
export class OptionsModule {}
