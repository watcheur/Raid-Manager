import { HttpModule, Module } from '@nestjs/common';
import { BlizzardController } from './blizzard.controller';
import { BlizzardService } from './blizzard.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [HttpModule, ConfigModule],
    controllers: [BlizzardController],
    providers: [BlizzardService],
    exports: [BlizzardService]
})
export class BlizzardModule {}
