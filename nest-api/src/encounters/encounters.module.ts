import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encounter } from './encounter.entity';
import { EncountersController } from './encounters.controller';
import { EncountersService } from './encounters.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Encounter])
	],
	controllers: [EncountersController],
	providers: [EncountersService],
	exports: [EncountersService]
})
export class EncountersModule {}