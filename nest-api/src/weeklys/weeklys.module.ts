import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { Weekly } from './weekly.entity';
import { WeeklysController } from './weeklys.controller';
import { WeeklysService } from './weeklys.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Weekly]),
    ],
    controllers: [WeeklysController],
    providers: [
        WeeklysService,
        AppGateway
    ],
    exports: [WeeklysService]
})
export class WeeklysModule {}
