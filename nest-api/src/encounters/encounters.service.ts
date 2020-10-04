import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Encounter } from './encounter.entity';

@Injectable()
export class EncountersService {
    constructor(
        @InjectRepository(Encounter)
        private readonly encountersRepository: Repository<Encounter>
    ) {}

    public async findAll(): Promise<Encounter[]>
    {
        return await this.encountersRepository.find();
    }

    public async findById(id: number): Promise<Encounter | null>
    {
        return await this.encountersRepository.findOne({
            relations: [ 'items' ],
            where: {
                id: id
            }
        });
    }

    public async findByName(name: string): Promise<Encounter[]>
    {
        return await this.encountersRepository.find({
            where: {
                name: Like(name)
            }
        });
    }

    public async findByRaid(raid: number): Promise<Encounter[]>
    {
        return await this.encountersRepository.find({
            where: {
                raid: raid
            }
        });
    }

    public async create(encounter: Encounter): Promise<Encounter>
    {
        return await this.encountersRepository.save(encounter);
    }

    public async update(id: number, newValue: Encounter): Promise<Encounter | null>
    {
        const encounter = await this.encountersRepository.findOneOrFail(id);
        if (!encounter.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.encountersRepository.update(id, newValue);
        return await this.encountersRepository.findOneOrFail(id);
    }
}