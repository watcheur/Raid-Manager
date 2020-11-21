import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpansionsController } from './expansions.controller';
import { ExpansionsService } from './expansions.service';
import { Expansion } from './expansion.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Expansion])],
    controllers: [ExpansionsController],
    providers: [
        ExpansionsService,
        AppGateway
    ],
    exports: [ExpansionsService]
})
export class ExpansionsModule {}
