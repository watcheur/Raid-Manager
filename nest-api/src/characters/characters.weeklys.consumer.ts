import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueRemoved, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { IChararacterJob } from "src/characters/interfaces/character.job.interface";
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { CharactersService } from './characters.service';
import { PeriodsService } from 'src/periods/periods.service';
import { WeeklysService } from 'src/weeklys/weeklys.service';
import { Period } from 'src/periods/period.entity';
import { Character } from './character.entity';
import { AppGateway, SocketAction, SocketChannel } from 'src/app.gateway';

@Processor('character-weeklys')
export class CharactersWeeklysConsumer
{
    private readonly logger = new Logger("CharactersWeeklysConsumer");

    constructor(
        private readonly blizzard: BlizzardService,
        private readonly characters: CharactersService,
        private readonly periods: PeriodsService,
        private readonly weeklys: WeeklysService,
        private readonly appGateway: AppGateway
    ) {}

    @Process()
    async loadCharacterWeeklys(job: Job<IChararacterJob>)
    {
        const characterId = +job.data.character;
        if (!characterId)
            throw new Error('Missing {character} property');

        const character = await this.characters.findById(characterId);
        if (!character)
            throw new Error('Character not found');
        
        const blizzardData = await this.blizzard.Character('mythic-keystone-profile', { realm: character.realm.slug, name: character.name.toLowerCase() });
        if (!blizzardData)
            throw new Error('Blizzard API error');
        
        if (!blizzardData.current_period || !blizzardData.current_period.best_runs)
            throw new Error("There is no period nor runs for this character");

        const periodId = +blizzardData.current_period.period.id;
        const period = await this.periods.findById(periodId);
        if (!period)
            throw new Error("Period not saved yet, will try later");

        const weeklys = (blizzardData.current_period.best_runs.map(run => {
            return {
                level: run.keystone_level,
                zone: run.dungeon.id,
                duration: run.duration,
                timed: run.is_completed_within_time,
                completed: new Date(run.completed_timestamp),
                affixes: run.keystone_affixes.map(affixe => affixe.id),
                members: run.members.map(member => `${member.character.name}-${member.character.realm.slug}`),
                period: periodId,
                character: characterId
            }
        }))

        weeklys.push({
            level: 10,
            zone: 42,
            duration: 4242424242,
            timed: true,
            completed: new Date(),
            affixes: [1,2,3,4],
            members: ['rhogar-ysondre', 'boby-lapointe', 'tintin-aucongo'],
            period: 777,
            character: characterId
        })

        const res = await this.weeklys.saveBatch(weeklys);

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