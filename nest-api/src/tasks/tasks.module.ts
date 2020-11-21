import { Module } from '@nestjs/common';
import { BlizzardModule } from 'src/blizzard/blizzard.module';
import { CharactersModule } from 'src/characters/characters.module';
import { EncountersModule } from 'src/encounters/encounters.module';
import { ExpansionsModule } from 'src/expansions/expansions.module';
import { PeriodsModule } from 'src/periods/periods.module';
import { RaidsModule } from 'src/raids/raids.module';
import { RealmsModule } from 'src/realms/realms.module';
import { SeasonsModule } from 'src/seasons/seasons.module';
import { WeeklysModule } from 'src/weeklys/weeklys.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ItemsModule } from 'src/items/items.module';

@Module({
    imports: [
        BlizzardModule,
        RealmsModule,
        SeasonsModule,
        PeriodsModule,
        WeeklysModule,
        ExpansionsModule,
        RaidsModule,
        EncountersModule,
        ItemsModule,
        CharactersModule
    ],
    providers: [TasksService],
    exports: [TasksService],
    controllers: [TasksController]
})
export class TasksModule {}
