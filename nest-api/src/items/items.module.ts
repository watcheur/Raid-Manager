import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlizzardModule } from 'src/blizzard/blizzard.module';
import { Item } from './item.entity';
import { ItemsConsumer } from './items.consumer';
import { ItemsController } from './items.controller';
import { ItemsMediaConsumer } from './items.media.consumer';
import { ItemsService } from './items.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Item]),
		BullModule.registerQueue({
			name: 'item'
		}),
		BullModule.registerQueue({
			name: 'item-media'
		}),
		BlizzardModule
	],
	controllers: [ItemsController],
	providers: [
		ItemsService,
		ItemsConsumer,
		ItemsMediaConsumer
	],
	exports: [ItemsService]
})
export class ItemsModule {}