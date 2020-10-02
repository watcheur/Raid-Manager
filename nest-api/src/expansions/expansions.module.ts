import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpansionsController } from './expansions.controller';
import { ExpansionsService } from './expansions.service';
import { Expansion } from './expansion.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Expansion])],
    controllers: [ExpansionsController],
    providers: [ExpansionsService],
    exports: [ExpansionsService]
})
export class ExpansionsModule {}
