import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { BlizzardModule } from 'src/blizzard/blizzard.module';
import { RealmsModule } from 'src/realms/realms.module';
import { PlayersModule } from 'src/players/players.module';
import { TeamsModule } from 'src/teams/teams.module';
import { BullModule } from '@nestjs/bull';
import { WeeklysModule } from 'src/weeklys/weeklys.module';
import { CharactersConsumer } from './characters.consumer';
import { CharactersItemsConsumer } from './characters.items.consumer';
import { CharactersWeeklysConsumer } from './characters.weeklys.consumer';
import { ItemsModule } from 'src/items/items.module';
import { CharacterItem } from './character.item.entity';
import { PeriodsModule } from 'src/periods/periods.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ Character, CharacterItem ]),
		BullModule.registerQueue({
			name: 'character'
		}),
		BullModule.registerQueue({
			name: 'character-items'
		}),
		BullModule.registerQueue({
			name: 'character-weeklys'
		}),
		RealmsModule,
		PlayersModule,
		BlizzardModule,
		WeeklysModule,
		PeriodsModule,
		ItemsModule,
		TeamsModule
	],
	controllers: [CharactersController],
	providers: [
		CharactersService,
		CharactersConsumer,
		CharactersItemsConsumer,
		CharactersWeeklysConsumer
	],
	exports: [CharactersService]
})
export class CharactersModule {}
