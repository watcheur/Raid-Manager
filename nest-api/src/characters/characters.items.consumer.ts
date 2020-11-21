import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueRemoved, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { IChararacterJob } from "src/characters/interfaces/character.job.interface";
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { CharactersService } from './characters.service';
import { ItemsService } from 'src/items/items.service';
import { CharacterItem } from './character.item.entity';

@Processor('character-items')
export class CharactersItemsConsumer
{
    private readonly logger = new Logger("CharactersItemsConsumer");

    constructor(
        private readonly blizzard: BlizzardService,
        private readonly items: ItemsService,
        private readonly characters: CharactersService,
    ) {}

    @Process()
    async loadCharacterItems(job: Job<IChararacterJob>)
    {
        const characterId = job.data.character;
        if (!characterId)
            throw new Error('Missing {character} property');

        const character = await this.characters.findById(characterId);
        if (!character)
            throw new Error('Character not found');
        
        const blizzardData = await this.blizzard.Character('equipment', { realm: character.realm.slug, name: character.name.toLowerCase() });
        if (!blizzardData)
            throw new Error('Blizzard API error');

        const characterItems = blizzardData.equipped_items.map(ei => {
            return {
                slot: ei.slot.type,
                quality: ei.quality.type,
                level: ei.level.value,
                bonuses: ei.bonus_list,
                sockets: (ei.sockets ? (ei.sockets.map(socket => (socket.item ? socket.item.id : 0))) : null),
                enchantments: (ei.enchantments ? ei.enchantments.map(enchant => enchant.enchantment_id) : null),
                item: ei.item.id,
                character: character.id
            }
        });

        const itemsPromises: Promise<any>[] = characterItems.map(ci => this.blizzard.GetItem(ci.item));

        const items = (await Promise.all(itemsPromises)).map(item => {
            return {
                id: item.id,
                name: item.name,
                slot: item.inventory_type.type,
                quality: item.quality.type,
                level: item.level
            }
        });

        await this.items.saveBatch(items);
        await this.characters.saveCharacterItems(character.id, characterItems);

        return characterItems;
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