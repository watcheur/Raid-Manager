import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidsController } from './raids.controller';
import { RaidsService } from './raids.service';
import { Raid } from './raid.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Raid])],
    controllers: [RaidsController],
    providers: [RaidsService],
    exports: [RaidsService]
})
export class RaidsModule {}
