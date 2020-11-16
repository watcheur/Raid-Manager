import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from 'src/seasons/season.entity';
import { Period } from './period.entity';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';

@Module({
	imports: [TypeOrmModule.forFeature([Period, Season])],
	controllers: [PeriodsController],
	providers: [PeriodsService],
	exports: [PeriodsService]
})
export class PeriodsModule {}
