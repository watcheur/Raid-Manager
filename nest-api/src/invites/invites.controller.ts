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
import { InviteDto } from './invites.dto';
import { TeamsService } from 'src/teams/teams.service';
import * as moment from 'moment';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
    constructor(
        private readonly invitesService: InvitesService,
        private readonly teamsService: TeamsService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return invitation info' })
    @Get(':hash')
    async get(@Request() req, @Param('hash') hash: string): Promise<Invite> {
        let invite = await this.invitesService.findByHash(hash);
        if (!invite)
            throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);

        return plainToClass(Invite, invite);
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Generate invitation' })
    @Post()
    async create(@Request() req, @Body() inviteDto: InviteDto): Promise<Partial<Invite>> {
        let invite = await this.invitesService.create(inviteDto.team, req.user);
        return {
            hash: invite.hash,
            expire: invite.expire
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Join server' })
    @Get('/join/:hash')
    async join(@Request() req, @Param('hash') hash: string): Promise<boolean> {
        let invite = await this.invitesService.findByHash(hash);

        if (!invite)
            throw new HttpException('Invite not found', HttpStatus.NOT_FOUND);

        if (moment(invite.expire).isBefore(moment().utc()))
            throw new HttpException('Invite expired', HttpStatus.BAD_REQUEST);

        let team = await this.teamsService.findByIdAndUser(invite.team.id, req.user);
        if (team)
            throw new HttpException('User already in', HttpStatus.BAD_REQUEST);

        this.teamsService.addUser(invite.team, req.user);

        return true;
    }
}
