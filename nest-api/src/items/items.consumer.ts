import { InjectQueue, OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueRemoved, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { ItemsService } from './items.service';
import { IItemJob } from './interfaces/item.job.interface';
import { AppGateway } from 'src/app.gateway';


@Processor('item')
export class ItemsConsumer
{
    private readonly logger = new Logger("ItemsConsumer");

    constructor(
        private readonly blizzard: BlizzardService,
        private readonly items: ItemsService,

        @InjectQueue('item-media') private itemsMediaQueue: Queue
    ) {}

    @Process()
    async loadItem(job: Job<IItemJob>)
    {
        const itemId = job.data.item;
        if (!itemId)
            throw new Error('Missing {item} property');

        const blizzardItem = await this.blizzard.GetItem(itemId);
        if (!blizzardItem)
            throw new Error("Can't get item data from blizzard API");

        const item = await this.items.saveRaw({
            id: blizzardItem.id,
            name: blizzardItem.name,
            slot: blizzardItem.inventory_type.type,
            quality: blizzardItem.quality.type,
            level: blizzardItem.level
        })

        if (!item)
            throw new Error("Error while saving blizzard data")

        // We add it to media queue
        await this.itemsMediaQueue.add({ item: itemId })

        return item;
    }

    @OnQueueActive()
    onActive(job: Job)
    {
        this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any)
    {
        this.logger.log(`Job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)} ended with result: ${JSON.stringify(result)}`);

        job.remove();
    }

    @OnQueueRemoved()
    onRemoved(job: Job)
    {
        this.logger.log(`Job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)} was removed`);
    }

    @OnQueueStalled()
    onStalled(job: Job)
    {
        this.logger.debug(`Job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)} is stalled`);
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error)
    {
        this.logger.error(`Job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)} failed with error ${error}`);
    }
}