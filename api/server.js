const Config = require('./config.json');
const TypeORM = require('typeorm');
const Restify = require('restify');
const Controllers = require('./controllers/Controllers');
const Logger = require('./utils/Logger');
const Queues = require('./utils/Queues');
const Jobs = require('./utils/Jobs');
const CronJob = require('cron').CronJob;

const server = Restify.createServer({
    name: 'raid-manager-api',
    handleUncaughtExceptions: true
});
server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.bodyParser({ mapParams: false }));

Config.database.entities = [
    new TypeORM.EntitySchema(require('./entity/Character')),
    new TypeORM.EntitySchema(require('./entity/Weekly')),
    new TypeORM.EntitySchema(require('./entity/Raid')),
    new TypeORM.EntitySchema(require('./entity/Boss'))
]

Logger.info('Create database connection');
TypeORM
    .createConnection(Config.database)
    .then((connection) => {
        Logger.info('Database initialized');

        // Characters endpoints
        server.get('/characters', Controllers.Character.GetAll);
        server.post('/characters', Controllers.Character.Create);
        server.get('/characters/:id', Controllers.Character.Get);
        server.put('/characters/:id', Controllers.Character.Update);
        server.del('/characters/:id', Controllers.Character.Delete);
        server.get('/characters/:id/refresh', Controllers.Character.ForceRefresh);
        server.get('/characters/:id/refresh-mythic', Controllers.Character.ForceRefreshMythic);

        // Weekly endpoints
        server.post('/weekly', Controllers.Weekly.Create);
        server.get('/weekly/:id', Controllers.Weekly.Get);
        server.put('/weekly/:id', Controllers.Weekly.Update);
        server.del('/weekly/:id', Controllers.Weekly.Delete);

        // Raids endpoints
        server.post('/raids', Controllers.Raid.Create);
        server.get('/raids/:id', Controllers.Raid.Get);
        server.put('/raids/:id', Controllers.Raid.Update);
        server.del('/raids/:id', Controllers.Raid.Delete);

        // Boss endpoints
        server.post('/bosses', Controllers.Boss.Create);
        server.get('/bosses/:id', Controllers.Boss.Get);
        server.put('/bosses/:id', Controllers.Boss.Update);
        server.del('/bosses/:id', Controllers.Boss.Delete);

        // Queues endpoints
        server.get('/queues/character/:id', (req, res, next) => {
            Queues.character.add({ character: req.params.id });
            res.send('Done');
            next();
        });

        server.get('/queues/weekly/:id', (req, res, next) => {
            Queues.weekly.add({ character: req.params.id});
            res.send('Done');
            next();
        });

        server.on('uncaughtException', (req, res, route, err) => {
            Logger.error('An uncaught error was catched', err);
            res.send({
                name: err.name,
                message: err.message
            });
        });

        server.listen(3005, () => {
            Logger.info('Server started');
        });
    });

Logger.info('Sarting character queue processing');
Queues.Character.process((job, done) => {
    Jobs.Character.Update(job.data.character, done);
}).catch(err => { Logger.error('Character queue processing failed'); })

Logger.info('Starting weekly queue processing');
Queues.Weekly.process((job, done) => {
    Jobs.Weekly.Update(job.data.character, done);
}).catch(err => { Logger.error('Weekly queue processing failed '); })

// Every 6 hours
var CharUpdateCron = new CronJob('* * */6 * * *', () => {
    Logger.info('Start refresh character cron');

    TypeORM.getRepository(require('./entity/Character').name)
        .createQueryBuilder('c')
        .select('c.id')
        .getMany()
        .then(chars => {
            chars.map(c => c.id).forEach(id => {
                Jobs.Character.Update(id, done);

                Logger.info('End refresh character cron');
            });
        })
        .catch(err => Logger.error("Error occured on character cron job", err));
});
CharUpdateCron.start();

// Every 8 hours
var WeeklyUpdateCron = new CronJob('* * */8 * * *', () => {
    Logger.info('Start refresh weekly cron');

    TypeORM.getRepository(require('./entity/Character').name)
        .createQueryBuilder('c')
        .select('c.id')
        .getMany()
        .then(chars => {
            chars.map(c => c.id).forEach(id => {
                Jobs.Weekly.Update(id, done);
            });

            Logger.info('End refresh weekly chest cron');
        })
        .catch(err => Logger.error("Error occured on weekly chest cron job", err));
});