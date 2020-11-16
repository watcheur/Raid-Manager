import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Wish])],
	controllers: [WishlistsController],
	providers: [WishlistsService],
	exports: [WishlistsService]
})
export class WishlistsModule {}
