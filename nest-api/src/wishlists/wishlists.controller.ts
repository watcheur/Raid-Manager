import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { RaidDifficulty } from 'src/raids/raid.entity';
import { WishDto } from './whish.dto';
import { WishlistsService } from './wishlists.service';

@ApiTags('wishlists')
@Controller('wishlists')
export class WishlistsController {
    constructor(
        private readonly wishlistsService: WishlistsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiQuery({ name: 'character', type: "number" })
    @ApiQuery({ name: 'item', required: false, type: "number" })
    @ApiQuery({ name: 'difficulty', enum: RaidDifficulty, required: false })
    @ApiQuery({ name: 'encounter', required: false, type: "number" })
    @ApiQuery({ name: 'raid', required: false, type: "number" })
    @ApiOperation({ summary: 'Retrieve wishlist of a given character' })
    @Get()
    async getAll(
        @Query('character') character: number,
        @Query('item') item: number,
        @Query('difficulty') difficulty: RaidDifficulty,
        @Query('encounter') encounter: number,
        @Query('raid') raid: number
    )
    {
        if (!character)
            throw new BadRequestException('No character');
        
        return await this.wishlistsService.findByParams({
            character: character,
            item: item,
            difficulty: difficulty,
            encounter: encounter,
            raid: raid
        })
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Toggle need of an item' })
    @Post()
    async toggle(@Body() wishDto: WishDto): Promise<boolean>
    {
        const needRes = await this.wishlistsService.findByParams({
            character: wishDto.character,
            item: wishDto.item,
            difficulty: wishDto.difficulty
        })

        if (needRes) {
            const need = needRes[0]; // They shouldn't be another one
            return this.wishlistsService.delete(need.id);
        }
        else
        {
            return (this.wishlistsService.create(wishDto) != undefined)
        }
    }
}
