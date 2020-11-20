import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { BlizzardModule } from 'src/blizzard/blizzard.module';
import { RealmsModule } from 'src/realms/realms.module';
import { PlayersModule } from 'src/players/players.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Character ]),
    RealmsModule,
    PlayersModule,
    BlizzardModule,
    TeamsModule
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
