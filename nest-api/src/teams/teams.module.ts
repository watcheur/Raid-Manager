import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TeamsController } from 'src/teams/teams.controller';
import { TeamsService } from 'src/teams/teams.service';

import { Team } from 'src/teams/team.entity';
import { User } from 'src/users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Team, User])],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService]
})
export class TeamsModule {}
