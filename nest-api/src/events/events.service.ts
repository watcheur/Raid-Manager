import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventDto } from './event.dto';
import { RaidsService } from 'src/raids/raids.service';
import { EncountersService } from 'src/encounters/encounters.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
        private readonly raidsService: RaidsService,
        private readonly encountersService: EncountersService,
        private readonly teamsService: TeamsService
    ) {}

    public async findAll(): Promise<Event[]>
    {
        return await this.eventsRepository.find({
            relations: [ "raid" ]
        });
    }

    public async findByTeam(teamId: number): Promise<Event[]>
    {
        return await this.eventsRepository.find({
            relations: [ "raid" ],
            where: {
                team: teamId
            }
        })
    }

    public async findById(id: number): Promise<Event | null>
    {
        return await this.eventsRepository.findOne({
            relations: [ "raid", "compositions" ],
            where: {
                id: id
            }
        })
    }

    public async findByIdAndTeam(id: number, teamId: number): Promise<Event | null>
    {
        return await this.eventsRepository.findOne({
            relations: [ "raid", "compositions" ],
            where: {
                id: id,
                team: teamId
            }
        })
    }

    public async findByRaidAndSchedule(raid: number, schedule: Date, teamId: number = 0): Promise<Event | null>
    {
        let where: any = {
            schedule: schedule,
            raid: raid
        };

        if (teamId)
            where.team = teamId;

        return await this.eventsRepository.findOne({
            where: where
        })
    }

    public async findNext(): Promise<Event | null>
    {
        return await this.eventsRepository.findOne({
            where: {
                schedule: MoreThanOrEqual(new Date())
            },
            order: {
                schedule: 'ASC'
            }
        })
    }

    public async findNextTeamEvent(teamId: number): Promise<Event | null>
    {
        return await this.eventsRepository.findOne({
            relations: [ 'raid' ],
            where: {
                schedule: MoreThanOrEqual(new Date()),
                team: teamId
            },
            order: {
                schedule: 'ASC'
            }
        })
    }

    public async create(event: EventDto, teamId: number): Promise<Event>
    {
        const raid = await this.raidsService.findById(event.raid);
        const team = await this.teamsService.findById(teamId);

        return await this.eventsRepository.save({
            name: event.name,
            schedule: event.schedule,
            difficulty: event.difficulty,
            raid: raid,
            team: team
        });
    }

    public async saveRaw(event: any): Promise<Event>
    {
        return await this.eventsRepository.save(event);
    }

    public async update(id: number, newValue: EventDto): Promise<Event | null>
    {
        const event = await this.eventsRepository.findOneOrFail({ relations: ['raid'], where: { id: id } });
        if (!event.id) {
            // tslint:disable-next-line:no-console
            console.error("event doesn't exist");
        }

        const raid = await this.raidsService.findById(newValue.raid || event.raid.id);

        await this.eventsRepository.update(id, {
            name: newValue.name || event.name,
            schedule: newValue.schedule || event.schedule,
            difficulty: newValue.difficulty || event.difficulty,
            raid: raid
        });
        return await this.eventsRepository.findOneOrFail(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.eventsRepository.delete(id);
        return res.affected > 0;
    }

    public async duplicate(id: number, newDate: Date): Promise<Event>
    {
        const event = await this.eventsRepository.findOneOrFail({
            relations: [ "raid", "compositions", "team" ],
            where: {
                id: id
            } 
        });
        if (!event.id) {
            // tslint:disable-next-line:no-console
            console.error("event doesn't exist");
        }

        /*
        const sameEvent = await this.findByRaidAndSchedule(event.raid.id, newDate, event.team.id)
        if (sameEvent)
            throw new BadRequestException('Already exist')
            */

        const newEvent = this.saveRaw({
            name: event.name,
            schedule: newDate,
            difficulty: event.difficulty,
            raid: event.raid.id,
            team: event.team.id
        });

        // TODO: Copy comps & notes

        return newEvent;
    }
}
