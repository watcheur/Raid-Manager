import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Item } from './item.entity';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectQueue('item') private itemsQueue: Queue,
        @InjectQueue('item-media') private itemsMediaQueue: Queue
    ) {}

    public async findAll(): Promise<Item[]>
    {
        return await this.itemsRepository.find();
    }

    public async findById(id: number): Promise<Item | null>
    {
        return await this.itemsRepository.findOne({
            relations: [ 'source' ],
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

    public async findByRaid(raid: number): Promise<Item[]>
    {
        return await this.itemsRepository.find({
            where: {
                encounter: {
                    raid: raid
                }
            }
        });
    }

    public async findIdsByMissingMedia(): Promise<number[]>
    {
        return (await this.itemsRepository.find({
            select: ['id'],
            where: {
                media: IsNull()
            }
        })).map(it => it.id);
    }

    public async findIdsWithMissingData(): Promise<number[]>
    {
        return (await this.itemsRepository.find({
            select: [ 'id' ],
            where: [
                { slot: IsNull() },
                { quality: IsNull() },
                { level: IsNull() }
            ]
        })).map(it => it.id);
    }

    public async save(item: Item): Promise<Item>
    {
        return await this.itemsRepository.save(item);
    }

    public async saveRaw(item: any): Promise<Item>
    {
        return await this.itemsRepository.save(item)
    }

    public async saveBatch(items: any[]): Promise<Item[]>
    {
        return await this.itemsRepository.save(items);
    }

    public async update(id: number, newValue: any): Promise<Item | null>
    {
        const encounter = await this.itemsRepository.findOneOrFail(id);
        if (!encounter.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.itemsRepository.update(id, newValue);
        return await this.itemsRepository.findOneOrFail(id);
    }

    public async addItemToQueue(id: number)
    {
        return this.itemsQueue.add({ item: id });
    }

    public async addItemToMediaQueue(id: number)
    {
        return this.itemsMediaQueue.add({ item: id });
    }
}
