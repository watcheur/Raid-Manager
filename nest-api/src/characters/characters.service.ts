import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Character } from './character.entity';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private readonly charactersRepository: Repository<Character>
    ) {}

    public async findByIds(ids: number[]): Promise<Character[]>
    {
        return this.charactersRepository.find({
            where:
            {
                id: In(ids)
            }
        })
    }
}