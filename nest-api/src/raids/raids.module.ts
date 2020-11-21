import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidsController } from './raids.controller';
import { RaidsService } from './raids.service';
import { Raid } from './raid.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Raid])],
    controllers: [RaidsController],
    providers: [
        RaidsService,
        AppGateway
    ],
    exports: [RaidsService]
})
export class RaidsModule {}
