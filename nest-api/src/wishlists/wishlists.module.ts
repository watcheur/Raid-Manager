import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Wish]),
		TeamsModule
	],
	controllers: [WishlistsController],
	providers: [WishlistsService],
	exports: [WishlistsService]
})
export class WishlistsModule {}
