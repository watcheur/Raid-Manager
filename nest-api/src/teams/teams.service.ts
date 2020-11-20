import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like } from 'typeorm';
import { Team } from 'src/teams/team.entity';
import { User } from 'src/users/user.entity';
import { TeamDto } from 'src/teams/teams.dto';

import moment from 'moment';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>
    ){}

    public async findAll() : Promise<Team[]>
    {
        return await this.teamRepository.find();
    }

    public async findById(id: number) : Promise<Team | null>
    {
        return await this.teamRepository.findOne({
            relations: [ 'users', 'founder', 'characters' ],
            where: {
                id: id
            }
        });
    }

    public async findByIdAndUser(id: number, user:User) : Promise<Team | null>
    {
        return await this.teamRepository.createQueryBuilder("team")
            .where('team.id = :teamId', { teamId: id })
            .andWhere('user.id = :userId', { userId: user.id })
            .leftJoinAndSelect("team.users", "user")
            .getOne();
    }

    public async findByName(name: string) : Promise<Team[]>
    {
        return await this.teamRepository.find({ name: Like(name) });
    }
    
    public async findByUser(user: User) : Promise<Team[]>
    {
        return await this.teamRepository.createQueryBuilder("team")
            .leftJoin("team.users", "user", "user.id = :userId", { userId: user.id })
            .getMany();
    }

    public async create(teamDto: TeamDto, founder: User) : Promise<Team>
    {
        let team = this.teamRepository.create({
            name: teamDto.name,
            founder: founder,
            users: [ founder ]
        })

        return await this.teamRepository.save(team);
    }

    public async save(team: Team): Promise<Team>
    {
        return await this.teamRepository.save(team);
    }

    public async update(
        id: number,
        newValue: TeamDto
    ) : Promise<Team | null>
    {
        const realm = await this.teamRepository.findOneOrFail(id);
        if (!realm.id) {
            // tslint:disable-next-line:no-console
            console.error("Realm doesn't exist");
        }

        await this.teamRepository.update(id, newValue);
        return await this.teamRepository.findOneOrFail(id);
    }

    public async addUser(team: Team, user: User) : Promise<void>
    {
        return this.teamRepository.createQueryBuilder()
            .relation(Team, 'users')
            .of(team)
            .add(user);
    }
}
