import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from 'src/teams/team.entity';
import { Repository } from 'typeorm';
import { PlayerUpdateDto } from './player-update.dto';
import { PlayerDto } from './player.dto';
import { Player } from './player.entity';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>
    ) {}

    public async findAll(): Promise<Player[]>
    {
        return await this.playersRepository.find();
    }

    public async findByTeam(teamId: number): Promise<Player[]>
    {
        return await this.playersRepository.find({
            where: {
                team: teamId
            }
        })
    }

    public async findById(playerId: number): Promise<Player | null>
    {
        return await this.playersRepository.findOne({
            relations: [ 'team' ],
            where: {
                id: playerId
            }
        })
    }

    public async findByName(name: string): Promise<Player | null>
    {
        return await this.playersRepository.findOne({
            relations: [ 'teams' ],
            where: {
                name: name
            }
        })
    }

    public async create(playerDto: PlayerDto, team: Team) : Promise<Player | null>
    {
        const player = this.playersRepository.create({
            name: playerDto.name,
            team: team
        });

        return await this.playersRepository.save(player);
    }

    public async update(
        id: number,
        newValue: PlayerUpdateDto
    ) : Promise<Player | null>
    {
        /*
        const player = await this.playersRepository.findOneOrFail(id);
        if (!player.id) {
            // tslint:disable-next-line:no-console
            console.error("Realm doesn't exist");
        }
        */

        await this.playersRepository.update(id, newValue);
        return await this.playersRepository.findOneOrFail(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.playersRepository.delete(id);
        return res.affected > 0;
    }
}
