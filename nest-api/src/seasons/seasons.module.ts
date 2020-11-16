import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from 'src/periods/period.entity';
import { Season } from './season.entity';
import { SeasonsController } from './seasons.controller';
import { SeasonsService } from './seasons.service';

@Module({
    imports: [TypeOrmModule.forFeature([Period, Season])],
    controllers: [SeasonsController],
    providers: [SeasonsService],
    exports: [SeasonsService]
})
export class SeasonsModule {}
