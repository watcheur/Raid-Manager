const TypeORM = require('typeorm');
const Controllers = require('../controllers/Controllers');
const Logger = require('../utils/Logger');
const Queues = require('../utils/Queues');
const CronJob = require('cron').CronJob;
const Context = require('../utils/Context');
const Entities = require('../entity/Entities');

module.exports = () => {
    // Every hours - Refresh current period
    new CronJob('0 0 */1 * * *', () => {
        Logger.info('Start refresh current period cron');

        TypeORM.getRepository(Entities.Period)
                .createQueryBuilder('p')
                .select('MAX(id) as max_id')
                .where('p.start <= :dt AND p.end >= :dt', { dt: new Date() })
                .getRawOne()
                .then(p => {
                    if (p != null ) {
                        Context.CurrentPeriod = p.max_id;
                        Logger.info(`Current period is now : ${Context.CurrentPeriod}`)
                    }
                });
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
    }, null, true, 'Europe/Paris');

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
    }, null, true, 'Europe/Paris');

    // Every wednesday -- Load new period(s)
    new CronJob('0 0 10 * * Wed', () => {
        Logger.info('Start refresh period cron');

        Controllers.Period.RefreshPeriods(null, null, () => {
            Logger.info('End refresh periods cron');
        });
    }, null, true, 'Europe/Paris');
}