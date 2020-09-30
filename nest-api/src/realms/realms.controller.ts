import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Request,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RealmsService } from 'src/realms/realms.service';
import { AuthGuard } from '@nestjs/passport';
import { RealmDto } from './realms.dto';

@ApiTags('realms')
@Controller('realms')
export class RealmsController {
    constructor(
        private readonly realmsService: RealmsService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Return all realms' })
    @Get()
    async getAll(): Promise<RealmDto[]> {
        return await this.realmsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Return given realm' })
    @Get(':id')
    async findOne(@Param('id') id:number): Promise<RealmDto> {
        return await this.realmsService.findById(id);
    }
}
