import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { WeeklysModule } from 'src/weeklys/weeklys.module';
import { WeeklysService } from 'src/weeklys/weeklys.service';
import { In, Repository } from 'typeorm';
import { CharacterDto } from './character.dto';
import { Character } from './character.entity';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { CharacterItem } from './character.item.entity';
import { Team } from 'src/teams/team.entity';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private readonly charactersRepository: Repository<Character>,

        @InjectRepository(CharacterItem)
        private readonly charactersItemsReposity: Repository<CharacterItem>,

        private readonly teamsService: TeamsService,

        @InjectQueue('character') private characterQueue: Queue,
        @InjectQueue('character-items') private characterItemsQueue: Queue,
        @InjectQueue('character-weeklys') private characterWeeklysQueue: Queue,
    ) {}

    public async findIds(): Promise<number[]>
    {
        return (await this.charactersRepository.createQueryBuilder().select('id').getRawMany()).map(c => c.id);
    }

    public async findAll(): Promise<Character[]>
    {
        return this.charactersRepository.find();
    }

    public async findById(id: number): Promise<Character>
    {
        return this.charactersRepository.findOne({
            relations: [ "realm", "player", "teams" ],
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

    public async saveCharacterItems(id: number, items: CharacterItem[]): Promise<CharacterItem[]>
    {
        const char = await this.charactersRepository.findOneOrFail(id);
        if (!char.id)
        {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        // Clean other items
        await this.charactersItemsReposity.delete({
            character: {
                id: id
            }
        })

        return await this.charactersItemsReposity.save(items);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.charactersRepository.delete(id);
        return res.affected > 0
    }

    public addCharacterToQueue(character: number): Promise<Job<any>> {
        return this.characterQueue.add({ character: character })
    }

    public addCharacterToItemsQueue(character: number): Promise<Job<any>> {
        return this.characterItemsQueue.add({ character: character })
    }

    public addCharacterToWeeklysQueue(character: number): Promise<Job<any>> {
        return this.characterWeeklysQueue.add({ character: character })
    }
}