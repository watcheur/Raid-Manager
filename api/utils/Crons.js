const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Controllers = require('../controllers/Controllers');
const Logger = require('../utils/Logger');
const Queues = require('../utils/Queues');
const CronJob = require('cron').CronJob;
const Context = require('../utils/Context');

module.exports = () => {
    // Every hours - Refresh current period & current xpac
    new CronJob('0 0 */1 * * *', () => {
        Logger.info('Start refresh current period cron');

        TypeORM.getRepository(Entities.Period)
            .createQueryBuilder('p')
            .where('p.start <= :dt AND p.end >= :dt', { dt: new Date() })
            .getOne()
            .then(p => {
                if (p != null ) {
                    Context.CurrentPeriod = p;
                    Logger.info('Current period is now :', Context.CurrentPeriod)
                }
            })
            .catch(err => {
                Logger.error('Error while retrieving current xpac', err);
            })
        
        TypeORM.getRepository(Entities.Expansion)
            .createQueryBuilder('a')
            .orderBy('id', 'DESC')
            .getOne()
            .then(xpac => {
                if (xpac != null) {
                    Context.CurrentExpansion = xpac;
                    Logger.info('Current xpac is now :', Context.CurrentExpansion)
                }
            })
            .catch(err => {
                Logger.error('Error while retrieving current xpac', err);
            })
    }, null, true, 'Europe/Paris', null, true);

    // Every 6 hours - Refresh all characters
    new CronJob('0 0 */6 * * *', () => {
        Logger.info('Start refresh characters cron');
        TypeORM.getRepository(Entities.Character)
            .createQueryBuilder('c')
            .select('c.id')
            .getMany()
            .then(chars => {
                chars.map(c => c.id).forEach(id => {
                    Queues.Character.add({ character: id });

                    Logger.info('End refresh character cron');
                });
            })
            .catch(err => Logger.error("Error occured on character cron job", err));
    }, null, true, 'Europe/Paris', null, true);

    // Every 8 hours -  Refresh all characters weekly
    new CronJob('0 0 */8 * * *', () => {
        Logger.info('Start refresh weekly cron');

        TypeORM.getRepository(Entities.Character)
            .createQueryBuilder('c')
            .select('c.id')
            .getMany()
            .then(chars => {
                chars.map(c => c.id).forEach(id => {
                    Queues.Weekly.add({ character: id });
                });

                Logger.info('End refresh weekly chest cron');
            })
            .catch(err => Logger.error("Error occured on weekly chest cron job", err));
    }, null, true, 'Europe/Paris', null, true);

    // Every wednesday @ 9am -- Load new period(s)
    new CronJob('0 0 9 * * Wed', () => {
        Logger.info('Start refresh period cron');

        Controllers.Period.RefreshPeriods(null, null, () => {
            Logger.info('End refresh periods cron');
        });


    }, null, true, 'Europe/Paris', null, true);

    // Every wednesday @ 0am -- Load new expansion(s)
    new CronJob('0 0 0 * * Wed', () => {
        Logger.info('Start refresh expansions cron');

        Controllers.Expansion.Refresh(null, null, () => {
            Logger.info('End refresh expansions cron');
        });
    }, null, true, 'Europe/Paris', null, true);

    // Every first of month -- Refresh all realms
    new CronJob('0 0 0 1 * *', () => {
        Logger.info('Start refresh realms cron');

        Controllers.Blizzard.LoadRealms(null, null, () => {
            Logger.info('End refresh realms cron');
        });
    }, null, true, 'Europe/Paris', null, true);

    // Every wednesday @ 1am -- Refresh all items who aren't updated
    new CronJob('0 1 9 * * Wed', () => {
        Logger.info('Start refresh unupdated items cron');

        TypeORM.getRepository(Entities.Item)
            .find({
                where: {
                    updated: TypeORM.IsNull()
                }
            })
            .then(items => {
                if (items) {
                    items.forEach(item => {
                        Queues.Item.add({ item: item.id });
                    });
                }
            })
            .catch(err => {
                Logger.error('Error retrieving raids', err);
                next(new Errs.InternalError('Database error'));
            })
    }, null, true, 'Europe/Paris', null, true);

    // Every wednesday @ 1am -- Refresh all items who aren't updated with a media
    new CronJob('0 1 9 * * Wed', () => {
        Logger.info('Start refresh unupdated items media cron');

        TypeORM.getRepository(Entities.Item)
            .find({
                where: {
                    media: TypeORM.IsNull()
                }
            })
            .then(items => {
                if (items) {
                    items.forEach(item => {
                        Queues.Media.add({ item: item.id });
                    });
                }
            })
            .catch(err => {
                Logger.error('Error retrieving items', err);
                next(new Errs.InternalError('Database error'));
            })
    }, null, true, 'Europe/Paris', null, true);
}