import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlizzardService } from 'src/blizzard/blizzard.service';
import { CharactersService } from 'src/characters/characters.service';
import { EncountersService } from 'src/encounters/encounters.service';
import { Expansion } from 'src/expansions/expansion.entity';
import { ExpansionsService } from 'src/expansions/expansions.service';
import { PeriodsService } from 'src/periods/periods.service';
import { RaidsService } from 'src/raids/raids.service';
import { Realm } from 'src/realms/realm.entity';
import { RealmsService } from 'src/realms/realms.service';
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

        let toSaveExpansions: Expansion[];

        blizzardExpansions.forEach(xpac => {
            toSaveExpansions.push({
                id: xpac.id,
                name: xpac.name,
                raids: []
            })
        });

        logger.log(`Found ${toSaveExpansions.length} expansions`);
        if (toSaveExpansions)
        {
            try {
                await this.expansions.saveBatch(toSaveExpansions);
                logger.log("Expansions saved");
            }
            catch (error)
            {
                logger.error("An error occured : " + error);
            }
        }
    }

    // Raids refresh - 9:30 AM every wednesday
    @Cron("30 9 * * WED", { name: 'expansions' })
    async raidsRefresh()
    {
        this.logger.log("Start raids refresher")
    }

    // Encounters refresh - 10:00 AM every wednesday
    @Cron("0 10 * * WED", { name: 'encounters' })
    async encountersRefresh()
    {
        this.logger.log("Start encounters refresher")
    }

    // Refresh items data - every 3 hours
    @Cron("0 */3 * * WED", { name: 'items' })
    async itemsRefresh()
    {
        this.logger.log("Start items loader")
    }

    // Refresh all items without media - every 4 hours
    @Cron("0 */4 * * WED", { name: 'items-media' })
    async itemsMediaRefresh()
    {
        this.logger.log("Start items medias loader")
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
        }
    }

    // ---- MYTHICAL KEYSTONE ----

    // Refresh mythic keystone seasons - 9:00 AM every Wednesday
    @Cron("0 9 * * WED", { name: 'seasons' })
    async seasonsRefresh()
    {
        this.logger.log("Start refreshing seasons")
    }

    // Refresh mythic keystone periods - 9:30 AM every Wednesday
    @Cron("30 9 * * WED", { name: 'periods' })
    async periodsRefresh()
    {
        this.logger.log("Start refreshing periods")
    }

    // Refresh characters mythic keystone dungeons - every 3 hours
    @Cron(CronExpression.EVERY_3_HOURS, { name: 'weeklys' })
    async weeklysRefresh()
    {
        this.logger.log("Start characters mythic keystone dungeons refresher")
    }

    // ---- CHARACTERS ----
    // Refresh characters equipment - every 5 hours
    @Cron(CronExpression.EVERY_5_HOURS, { name: 'characters' })
    async refreshCharactersItems()
    {
        this.logger.log("Start characters items refresher")
    }
}
