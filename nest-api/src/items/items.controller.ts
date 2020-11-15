import { Controller, Get, NotFoundException, Param, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Item } from './item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(
        private readonly itemsService: ItemsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get all items' })
    @Get()
    async getAll(): Promise<Item[]> {
        return plainToClass(Item, await this.itemsService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Get given item' })
    @Get(':id')
    async get(@Param('id') id: number): Promise<Item | null> {
        const item = await this.itemsService.findById(id);
        if (!item)
            throw new NotFoundException('Item not found');

        return plainToClass(Item, item);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return item media' })
    @Get(':id/media')
    async getMedia(@Param('id') id: number, @Res() response) {
        return {};
    }
}
