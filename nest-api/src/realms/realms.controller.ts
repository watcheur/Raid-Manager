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
    Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IRealmWhere, RealmsService } from 'src/realms/realms.service';
import { AuthGuard } from '@nestjs/passport';
import { RealmDto } from './realms.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@ApiTags('realms')
@Controller('realms')
export class RealmsController {
    constructor(
        private readonly realmsService: RealmsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return all realms' })
    @ApiQuery({ name: 'category', type: 'string', required: false })
    @ApiQuery({ name: 'region', type: 'string', required: false })
    @ApiQuery({ name: 'locale', type: 'string', required: false })
    @Get()
    async getAll(@Query() params: IRealmWhere): Promise<RealmDto[]> {
        return await this.realmsService.findAll(params);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return given realm' })
    @Get(':id')
    async findOne(@Param('id') id:number): Promise<RealmDto> {
        return await this.realmsService.findById(id);
    }
}
