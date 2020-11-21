import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { Season } from 'src/seasons/season.entity';
import { Period } from './period.entity';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';

@Module({
	imports: [TypeOrmModule.forFeature([Period, Season])],
	controllers: [PeriodsController],
	providers: [
		PeriodsService,
		AppGateway
	],
	exports: [PeriodsService]
})
export class PeriodsModule {}
