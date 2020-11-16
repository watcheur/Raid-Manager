import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/teams/team.entity';
import { TeamsService } from 'src/teams/teams.service';
import { Player } from './player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
    imports: [TypeOrmModule.forFeature([Player, Team])],
    controllers: [PlayersController],
    providers: [
      PlayersService,
      TeamsService
    ],
    exports: [PlayersService]
  })
  export class PlayersModule {}