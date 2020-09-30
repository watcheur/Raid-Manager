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
    Delete, UseInterceptors, ClassSerializerInterceptor, HttpException
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';
import { InvitesService } from './invites.service';
import { Invite } from './invite.entity';
import { get } from 'http';

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
    constructor(
        private readonly invitesService: InvitesService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Return invitation info' })
    @Get(':hash')
    async get(@Request() req, @Param('hash') hash: string): Promise<Invite> {
        let invite = await this.invitesService.findByHash(hash);
        if (!invite)
            throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);

        return plainToClass(Invite, invite);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Generate invitation' })
    @Post('/create/:team')
    async create(@Request() req, @Param('team') team: number): Promise<Partial<Invite>> {
        let invite = await this.invitesService.create(team, req.user);
        return {
            hash: invite.hash,
            expire: invite.expire
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Join server' })
    @Get('/join/:hash')
    async invite(@Request() req, @Param('hash') hash: string): Promise<boolean> {
        let invite = await this.invitesService.findByHash(hash);

        if (!invite)
            throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);

        

        return true;
    }
}
