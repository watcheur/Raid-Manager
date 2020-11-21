import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TeamsController } from 'src/teams/teams.controller';
import { TeamsService } from 'src/teams/teams.service';

import { Team } from 'src/teams/team.entity';
import { User } from 'src/users/user.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    controllers: [TeamsController],
    providers: [
        TeamsService,
        AppGateway
    ],
    exports: [TeamsService]
})
export class TeamsModule {}
