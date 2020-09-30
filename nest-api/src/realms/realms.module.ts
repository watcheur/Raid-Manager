import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsController } from './realms.controller';
import { RealmsService } from './realms.service';
import { Realm } from './realm.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Realm])],
    controllers: [RealmsController],
    providers: [RealmsService],
    exports: [RealmsService]
})
export class RealmsModule {}
