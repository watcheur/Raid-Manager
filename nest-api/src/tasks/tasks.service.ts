import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { CharactersService } from 'src/characters/characters.service';
import { Encounter } from 'src/encounters/encounter.entity';
import { EncountersService } from 'src/encounters/encounters.service';
import { Expansion } from 'src/expansions/expansion.entity';
import { ExpansionsService } from 'src/expansions/expansions.service';
import { ItemsService } from 'src/items/items.service';
import { Period } from 'src/periods/period.entity';
import { PeriodsService } from 'src/periods/periods.service';
import { Raid } from 'src/raids/raid.entity';
import { RaidsService } from 'src/raids/raids.service';
import { Realm } from 'src/realms/realm.entity';
import { RealmsService } from 'src/realms/realms.service';
import { Season } from 'src/seasons/season.entity';
import { SeasonsService } from 'src/seasons/seasons.service';
import { WeeklysService } from 'src/weeklys/weeklys.service';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly blizzard: BlizzardService,
        private readonly realms: RealmsService,
        private readonly seasons: SeasonsService,
        private readonly periods: PeriodsService,
        private readonly weeklys: WeeklysService,
        private readonly items: ItemsService,
        private readonly expansions: ExpansionsService,
        private readonly raids: RaidsService,
        private readonly encounters: EncountersService,
        private readonly characters: CharactersService,
    ){}

    // ---- GAME DATA ----
    
    // Expansions refresh - 9:00 AM every wednesday
    @Cron("0 9 * * WED", { name: 'expansions' })
    async expansionsRefresh()
    {
        this.logger.log("Start expansions refresher");
        const logger = new Logger("ExpansionsRefresher", true);
        logger.log("Started")

        const blizzardExpansions = await this.blizzard.GetExpansions();

        let expansions: Expansion[] = blizzardExpansions.map(xpac => {
            return {
                id: xpac.id,
                name: xpac.name,
                raids: []
            }
        });

        logger.log(`Found ${expansions.length} expansions`);
        try {
            await this.expansions.saveBatch(expansions);
            logger.log("Expansions saved");
        }
        catch (error)
        {
            logger.error("An error occured : " + error);
            throw new InternalServerErrorException(error);
        }

        return expansions;
    }

    // Raids refresh - 9:30 AM every wednesday
    @Cron("30 9 * * WED", { name: 'raids' })
    async raidsRefresh()
    {
        this.logger.log("Start raids refresher")
        const logger = new Logger("RaidsRefresher", true);
        logger.log("Started")

        const expansions = await this.blizzard.GetExpansions();
        const xpacPromises = expansions.map(xpac => this.blizzard.GetExpansion(xpac.id));
        const expansionsDetails: any[] = await Promise.all(xpacPromises);
        const raidsPromises = [].concat(...expansionsDetails.map(xpac => xpac.raids.map(raid => this.blizzard.GetInstance(raid.id))));
        const raidsDetails: any[] = await Promise.all(raidsPromises);

        let totalEncounters = 0;
        const raids: Raid[] = raidsDetails.map(raid => {
            totalEncounters += raid.encounters.length;
            return {
                id: raid.id,
                name: raid.name,
                minimum_level: raid.minimum_level,
                expansion: raid.expansion.id,
                encounters: raid.encounters.map(encounter => {
                    return {
                        id: encounter.id,
                        name: encounter.name,
                        raid: raid.id
                    }
                })
            }
        });

        logger.log(`Found ${raids.length} raids with a total of ${totalEncounters} encounters`);
        try {
            await this.raids.saveBatch(raids);
            logger.log("Raids saved");
        }
        catch (error)
        {
            logger.error("An error occured : " + error);
            throw new InternalServerErrorException(error);
        }

        return raids;
    }

    // Encounters refresh - 10:00 AM every wednesday
    @Cron("0 10 * * WED", { name: 'encounters' })
    async encountersRefresh()
    {
        this.logger.log("Start encounters refresher")
        const logger = new Logger("EncountersRefresher", true);
        logger.log("Started")

        const savedEncounters = await this.encounters.findAll();

        if (!savedEncounters)
            return [];

        const encountersPromises = savedEncounters.map(ec => this.blizzard.GetEncounter(ec.id));

        let itemsFound = 0;
        const encounters: Encounter[] = (await Promise.all(encountersPromises)).map(encounter => {
            itemsFound += encounter.items.length;
            return {
                id: encounter.id,
                name: encounter.name,
                items: encounter.items.map(drop => {
                    return {
                        id: drop.item.id,
                        name: drop.item.name,
                        source: encounter.id
                    }
                })
            }
        });

        logger.log(`Found ${encounters.length} raids with a total of ${itemsFound} items`);
        try {
            await this.encounters.saveBatch(encounters);
            logger.log("Encounters saved");
        }
        catch (error)
        {
            logger.error("An error occured : " + error);
            throw new InternalServerErrorException(error);
        }

        return encounters;
    }

    // Refresh items without data - every 3 hours
    @Cron("0 */3 * * WED", { name: 'items' })
    async itemsRefresh()
    {
        this.logger.log("Start items loader")
        const logger = new Logger("ItemsRefresher", true);
        logger.log("Started")

        const ids = await this.items.findIdsByMissingMedia();
        
        await Promise.all(ids.map(id => this.items.addItemToQueue(id)));

        return ids;
    }

    async itemRefresh(id: number)
    {
        this.logger.log("Start item refresh")
        const logger = new Logger("ItemRefresher", true);
        logger.log(`Started with item id: ${id}`)

        await Promise.all([
            this.items.addItemToQueue(id),
            this.items.addItemToMediaQueue(id)
        ])

        return id;
    }

    // Refresh all items without media - every 4 hours
    @Cron("0 */4 * * WED", { name: 'items-media' })
    async itemsMediaRefresh()
    {
        this.logger.log("Start items medias loader")
        const logger = new Logger("ItemsMediaRefresher", true);
        logger.log("Started")

        const ids = await this.items.findIdsByMissingMedia();

        await Promise.all(ids.map(id => this.items.addItemToMediaQueue(id)));

        return ids;
    }

    // Refresh all realms - 01:00 AM monday
    @Cron("0 1 * * MON", { name: 'realms' })
    async realmsRefresh()
    {
        this.logger.log("Start realms loader");
        const logger = new Logger("RealmsRefresher", true);
        logger.log("Started");

        const blizzardRealms = await this.blizzard.GetRealms();

        let realms: Realm[] = [].concat(...blizzardRealms.map(cR => cR.realms.map(r => {
            return {
                id: r.id,
                name: r.name,
                slug: r.slug,
                category: r.category,
                region: r.region.name,
                locale: r.locale,
                timezone: r.timezone,
                group: cR.id
            }
        })))

        logger.log(`Found ${realms.length} realms`);
        try
        {
            if (realms) {
                await this.realms.saveBatch(realms);
                logger.log("Saved");
            }
        }
        catch (error)
        {
            logger.error('Error while saving realms : ' + error);
            throw new InternalServerErrorException(error);
        }

        return realms;
    }

    // ---- MYTHICAL KEYSTONE ----

    // Refresh mythic keystone seasons - 9:00 AM every Wednesday
    @Cron("0 9 * * WED", { name: 'seasons' })
    async seasonsRefresh()
    {
        this.logger.log("Start refreshing seasons")
        const logger = new Logger("SeasonsRefresher", true);
        logger.log("Started")

        const seasonsPromises: Promise<any>[] = (await this.blizzard.GetMythicKeystoneSeasons()).seasons.map(s => this.blizzard.GetMythicKeystoneSeason(s.id));

        const seasons: Season[] = (await Promise.all(seasonsPromises)).map(season => {
            return {
                id: season.id,
                start: new Date(season.start_timestamp),
                end: season.end_timestamp ? new Date(season.end_timestamp) : null,
                current: (!season.end_timestamp && (season.start_timestamp * 1000) > new Date().getTime())
            }
        });

        logger.log(`Found ${seasons.length} seasons`);
        try
        {
            if (seasons) {
                await this.seasons.saveBatch(seasons);
                logger.log("Saved");
            }
        }
        catch (error)
        {
            logger.error('Error while saving seasons : ' + error);
            throw new InternalServerErrorException(error);
        }

        return seasons;
    }

    // Refresh mythic keystone periods - 9:30 AM every Wednesday
    @Cron("30 9 * * WED", { name: 'periods' })
    async periodsRefresh()
    {
        this.logger.log("Start refreshing periods")
        const logger = new Logger("PeriodsRefresher", true);
        logger.log("Started")

        const seasonsPromises: Promise<any>[] = (await this.blizzard.GetMythicKeystoneSeasons()).seasons.map(s => this.blizzard.GetMythicKeystoneSeason(s.id));
        
        const periods = [].concat(...await Promise.all(((await Promise.all(seasonsPromises)).map(async season => {
            let periodsPromises: Promise<any>[] = season.periods.map(period => this.blizzard.GetMythicKeystonePeriod(period.id));

            return (await Promise.all(periodsPromises)).map(period => {
                return {
                    id: period.id,
                    start: new Date(period.start_timestamp),
                    end: new Date(period.end_timestamp),
                    season: season.id
                }
            })
        }))));

        logger.log(`Found ${periods.length} periods`);
        try
        {
            if (periods) {
                await this.periods.saveBatch(periods);
                logger.log("Saved");
            }
        }
        catch (error)
        {
            logger.error('Error while saving periods : ' + error);
            throw new InternalServerErrorException(error);
        }

        return periods;
    }

    // ---- CHARACTERS ----
    // Refresh characters mythic keystone dungeons - every 3 hours
    @Cron(CronExpression.EVERY_2_HOURS, { name: 'characters' })
    async charactersRefresh()
    {
        this.logger.log("Start characters refresher");

        const charactersIds = await this.characters.findIds();

        await Promise.all(charactersIds.map(id => this.characters.addCharacterToQueue(id)));

        return charactersIds;
    }

    @Cron(CronExpression.EVERY_3_HOURS, { name: 'weeklys' })
    async charactersWeeklysRefresh()
    {
        this.logger.log("Start characters mythic keystone dungeons refresher");

        const charactersIds = await this.characters.findIds();

        await Promise.all(charactersIds.map(id => this.characters.addCharacterToWeeklysQueue(id)));

        return charactersIds;
    }

    // Refresh characters equipment - every 5 hours
    @Cron(CronExpression.EVERY_5_HOURS, { name: 'characters-items' })
    async charactersItemsRefresh()
    {
        this.logger.log("Start characters items refresher");

        const charactersIds = await this.characters.findIds();

        await Promise.all(charactersIds.map(id => this.characters.addCharacterToItemsQueue(id)));

        return charactersIds;
    }

    async characterRefresh(id: number)
    {
        this.logger.log(`Start character (${id}) refresh`);

        await Promise.all([
            this.characters.addCharacterToQueue(id),
            this.characters.addCharacterToItemsQueue(id)
        ])

        return id;
    }
}
