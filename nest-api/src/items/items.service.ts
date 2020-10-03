import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>
    ) {}

    public async findAll(): Promise<Item[]>
    {
        return await this.itemsRepository.find();
    }

    public async findById(id: number): Promise<Item | null>
    {
        return await this.itemsRepository.findOne({
            relations: [ 'encounter' ],
            where: {
                id: id
            }
        });
    }

    public async findByEncounter(encounter: number): Promise<Item[]>
    {
        return await this.itemsRepository.find({
            where: {
                encounter: encounter
            }
        });
    }

    public async findByRaid(encounter: number): Promise<Item[]>
    {
        return await this.itemsRepository.find({
            where: {
                encounter: encounter
            }
        });
    }

    public async create(encounter: Item): Promise<Item>
    {
        return await this.itemsRepository.save(encounter);
    }

    public async update(id: number, newValue: Item): Promise<Item | null>
    {
        const encounter = await this.itemsRepository.findOneOrFail(id);
        if (!encounter.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.itemsRepository.update(id, newValue);
        return await this.itemsRepository.findOneOrFail(id);
    }
}
