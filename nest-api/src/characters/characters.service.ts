import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { In, Repository } from 'typeorm';
import { CharacterDto } from './character.dto';
import { Character } from './character.entity';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private readonly charactersRepository: Repository<Character>,
        private readonly teamsService: TeamsService
    ) {}

    public async findAll(): Promise<Character[]>
    {
        return this.charactersRepository.find();
    }

    public async findById(id: number): Promise<Character>
    {
        return this.charactersRepository.findOne({
            relations: [ "player", "teams" ],
            where: {
                id: id
            }
        });
    }

    public async findByTeam(teamId: number): Promise<Character[]>
    {
        const team = await this.teamsService.findById(teamId);
        if (!team)
            return [];
        
        return team.characters;
    }

    public async findByIdAndTeam(id: number, teamId: number): Promise<Character>
    {
        return await this.charactersRepository.createQueryBuilder("character")
            .leftJoin("character.teams", "team", "team.id = :teamId", { teamId: teamId })
            .getOne();
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

    public async update(id: number, newValue: any): Promise<Character>
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

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.charactersRepository.delete(id);
        return res.affected > 0
    }
}