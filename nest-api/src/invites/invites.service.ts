import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Team } from 'src/teams/team.entity';
import { TeamsService } from 'src/teams/teams.service';
import { Invite } from './invite.entity';
import { nanoid, customAlphabet } from 'nanoid';

import * as moment from 'moment';

@Injectable()
export class InvitesService {
    constructor(
        @InjectRepository(Invite)
        private readonly inviteRepository: Repository<Invite>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @Inject(TeamsService)
        private readonly teamsService: TeamsService
    ){}

    public async findById(id: number) : Promise<Invite | null>
    {
        return await this.inviteRepository.findOne({
            relations: [ 'team' ],
            where: {
                id: id
            }
        });
    }

    public async findByHash(hash: string) : Promise<Invite | null>
    {
        return await this.inviteRepository.findOne({
            relations: [ 'team' ],
            where: {
                hash: hash
            }
        });
    }

    private async checkAndGenerateHash(tries: number = 0) : Promise<string> {
        if (tries > 10)
            throw new HttpException('Error while generating hash', HttpStatus.INTERNAL_SERVER_ERROR);

        let hash = await nanoid(10);
        let invite = await this.findByHash(hash);
        if (invite)
            return this.checkAndGenerateHash(tries++);
        return hash;
    }

    public async create(id: number, user: User) : Promise<Invite | null>
    {
        const team = await this.teamsService.findByIdAndUser(id, user);
        if (!team)
            return null;

        let invite = this.inviteRepository.create({
            expire: moment().add(15, 'day').utc().toDate(),
            team: team,
            hash: await this.checkAndGenerateHash(),
            owner: user
        });

        return this.inviteRepository.save(invite);
    }
}
