import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueRemoved, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { IChararacterJob } from "src/characters/interfaces/character.job.interface";
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { CharactersService } from './characters.service';
import { AppGateway, SocketAction, SocketChannel } from 'src/app.gateway';

@Processor('character')
export class CharactersConsumer
{
    private readonly logger = new Logger("CharactersConsumer");

    constructor(
        private readonly blizzard: BlizzardService,
        private readonly characters: CharactersService,
        private readonly appGateway: AppGateway
    ) {}

    @Process()
    async loadCharacter(job: Job<IChararacterJob>)
    {
        const characterId = job.data.character;
        if (!characterId)
            throw new Error('Missing {character} property');

        const character = await this.characters.findById(characterId);
        if (!character)
            throw new Error('Character not found');
        
        const blizzardData = await this.blizzard.Character('', { realm: character.realm.slug, name: character.name.toLowerCase() });
        if (!blizzardData)
            throw new Error('Blizzard API error');

        const res = await this.characters.update(characterId, {
            level: blizzardData.level,
            race: blizzardData.race.id,
            gender: blizzardData.gender.type,
            faction: blizzardData.faction.type,
            class: blizzardData.character_class.id,
            spec: blizzardData.active_spec.id || 0,
            avg: blizzardData.average_item_level,
            equipped: blizzardData.equipped_item_level
        });

        character.teams.forEach(team => {
            this.appGateway.emit(team.id, SocketChannel.Character, {
                action: SocketAction.Updated,
                data: {
                    character: characterId
                }
            })
        })

        return res;
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