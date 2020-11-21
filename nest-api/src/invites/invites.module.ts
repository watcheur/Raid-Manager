import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/teams/team.entity';
import { User } from 'src/users/user.entity';
import { Invite } from 'src/invites/invite.entity';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { TeamsService } from 'src/teams/teams.service';
import { AppGateway } from 'src/app.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Invite, Team, User])],
    controllers: [InvitesController],
    providers: [
        InvitesService,
        TeamsService,
        AppGateway
    ],
    exports: [InvitesService]
})
export class InvitesModule {}
