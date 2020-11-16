import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Character ])],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
