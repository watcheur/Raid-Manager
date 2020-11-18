import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CharacterDto } from './character.dto';
import { Character } from './character.entity';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private readonly charactersRepository: Repository<Character>
    ) {}

    public async findAll(): Promise<Character[]>
    {
        return this.charactersRepository.find();
    }

    public async findById(id: number): Promise<Character>
    {
        return this.charactersRepository.findOne(id);
    }

    public async findByName(name: string): Promise<Character>
    {
        return this.charactersRepository.findOne({
            where: {
                name: name
            }
        })
    }

    public async findByIds(ids: number[]): Promise<Character[]>
    {
        return this.charactersRepository.find({
            where:
            {
                id: In(ids)
            }
        })
    }

    public async save(character: CharacterDto): Promise<Character>
    {
        return await this.charactersRepository.save({
            name: character.name,
            realmId: character.realm,
            type: character.type
        });
    }

    public async saveRaw(character: any): Promise<Character>
    {
        return await this.charactersRepository.save(character);
    }

    public async update(id: number, newValue: any)
    {
        const char = await this.charactersRepository.findOneOrFail(id);
        if (!char.id)
        {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.charactersRepository.update(id, newValue);
        return await this.findById(id);
    }
}