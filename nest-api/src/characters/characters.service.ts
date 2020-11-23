import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { WeeklysModule } from 'src/weeklys/weeklys.module';
import { WeeklysService } from 'src/weeklys/weeklys.service';
import { In, Like, Repository } from 'typeorm';
import { CharacterDto } from './character.dto';
import { Character } from './character.entity';
import { CharacterType, CharacterClass, CharacterSpec } from './enums';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { CharacterItem } from './character.item.entity';
import { Team } from 'src/teams/team.entity';
import { AppGateway } from 'src/app.gateway';
import { PeriodsService } from 'src/periods/periods.service';
import { Realm } from 'src/realms/realm.entity';
import { Player, PlayerCharacter } from 'src/players/player.entity';
import { Item } from 'src/items/item.entity';
import { Weekly } from 'src/weeklys/weekly.entity';

export interface ICharactersWhere {
    name?: string;
    realm?: number;
    type?: CharacterType,
    level?: number;
    class?: CharacterClass,
    spec?: CharacterSpec,
    equipped?: number,
    average?: number
}

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private readonly charactersRepository: Repository<Character>,

        @InjectRepository(CharacterItem)
        private readonly charactersItemsReposity: Repository<CharacterItem>,

        private readonly teamsService: TeamsService,
        private readonly periodsService: PeriodsService,

        @InjectQueue('character') private characterQueue: Queue,
        @InjectQueue('character-items') private characterItemsQueue: Queue,
        @InjectQueue('character-weeklys') private characterWeeklysQueue: Queue
    ) {}

    public async findIds(): Promise<number[]>
    {
        return (await this.charactersRepository.createQueryBuilder().select('id').getRawMany()).map(c => c.id);
    }

    public async findAll(where?: ICharactersWhere): Promise<Character[]>
    {
        return this.charactersRepository.find({
            where: where
        });
    }

    public async findById(id: number): Promise<Character>
    {
        return this.charactersRepository.findOne({
            relations: [ "realm", "teams" ],
            where: {
                id: id
            }
        });
    }

    public async findByTeam(teamId: number, where?: ICharactersWhere): Promise<Character[]>
    {
        const team = await this.teamsService.findById(teamId);
        if (!team)
            return [];
            
        const ids = team.characters.map(c => c.id);
        const period = await this.periodsService.findCurrent();

        let req = await this.charactersRepository.createQueryBuilder("C")
            .innerJoinAndMapOne("C.realm", Realm, "R", "R.id = C.realm")
            .leftJoinAndMapMany("C.players", PlayerCharacter, "PC", "PC.character = C.id")
            .leftJoinAndMapOne("PC.player", Player, "P", "PC.player = P.id AND P.team = :teamId", { teamId: team.id })
            .leftJoinAndMapMany("C.items", CharacterItem, "CI", "CI.character = C.id")
            .leftJoinAndMapOne("CI.item", Item, "IT", "IT.id = CI.item")
            .leftJoinAndMapOne("CI.character", Character, "Ca", "Ca.id = CI.character")
            .leftJoinAndMapMany("C.weeklys", Weekly, "W", `W.period = ${period.id ?? -1}`)
            .where("C.id IN(:...ids)", { ids: ids })

        if (where)
        {
            if (where.name)
                req = req.where("C.name LIKE :name")
            if (where.realm)
                req = req.where("C.realm = :realm")
            if (where.type)
                req = req.where("C.type = :type")
            if (where.level)
                req = req.where("C.level = :level")
            if (where.class)
                req = req.where("C.class = :class")
            if (where.spec)
                req = req.where("C.spec = :spec")
            if (where.equipped)
                req = req.where("C.equipped = :equipped")
            if (where.average)
                req = req.where("C.average = :average")
            
            req = req.setParameters(where);
        }

        return req.getMany();
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