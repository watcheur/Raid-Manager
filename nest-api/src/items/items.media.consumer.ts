import { InjectQueue, OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueRemoved, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { ItemsService } from './items.service';
import { IItemJob } from './interfaces/item.job.interface';

import { parse } from 'url';

@Processor('item-media')
export class ItemsMediaConsumer
{
    private readonly logger = new Logger("ItemsMediaConsumer");

    constructor(
        private readonly blizzard: BlizzardService,
        private readonly items: ItemsService,

        @InjectQueue('item') private itemsQueue: Queue,
    ) {}

    @Process()
    async loadItem(job: Job<IItemJob>)
    {
        const itemId = job.data.item;
        if (!itemId)
            throw new Error('Missing {item} property');

        const item = await this.items.findById(itemId);
        if (!item)
        {
            this.itemsQueue.add({ item: itemId });
            throw new Error('Item not found, adding it to item queue for loading');
        }

        const blizzardItemMedia = await this.blizzard.GetItemMedia(itemId);
        if (!blizzardItemMedia)
            throw new Error("Can't get blizzard media data");
        
        const ico = blizzardItemMedia.assets.find(asset => asset.key === "icon");
        if (!ico)
            throw new Error("Can't find icon");

        await this.items.update(itemId, {
            media: parse(ico.value).pathname
        })

        return ico;
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