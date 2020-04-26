const Config = require('./config.json');
const TypeORM = require('typeorm');
const Restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')
const Controllers = require('./controllers/Controllers');
const Logger = require('./utils/Logger');
const Queues = require('./utils/Queues');
const Socket = require('./utils/Socket');
const Jobs = require('./jobs/Jobs');
const Entities = require('./entity/Entities');

const server = Restify.createServer({
    name: 'raid-manager-api',
    handleUncaughtExceptions: true
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: [],
    exposeHeaders: []
})
  
server.pre(cors.preflight)
server.use(cors.actual)
server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.bodyParser({ mapParams: false }));

Config.database.entities = Entities.All;

Logger.info('Create database connection');
TypeORM
    .createConnection(Config.database)
    .then((connection) => {
        Logger.info('Database initialized');

        server.get('/expansions', Controllers.Expansion.GetAll);
        server.get('/expansions/current', Controllers.Expansion.Get)
        server.get('/expansions/refresh', Controllers.Expansion.Refresh);

        // Characters endpoints
        server.get('/characters', Controllers.Character.GetAll);
        server.post('/characters', Controllers.Character.Create);
        server.get('/characters/:id', Controllers.Character.Get);
        server.put('/characters/:id', Controllers.Character.Update);
        server.del('/characters/:id', Controllers.Character.Delete);
        server.get('/characters/:id/refresh', Controllers.Character.ForceRefresh);

        // Period
        server.get('/periods', Controllers.Period.GetAll);
        server.get('/periods/:id', Controllers.Period.Get);
        server.get('/periods/current', Controllers.Period.GetCurrent);
        server.get('/periods/refresh', Controllers.Period.RefreshPeriods);

        // Weekly endpoints
        server.post('/weeklys', Controllers.Weekly.Create);
        server.get('/weeklys/:id', Controllers.Weekly.Get);
        server.put('/weeklys/:id', Controllers.Weekly.Update);
        server.del('/weeklys/:id', Controllers.Weekly.Delete);

        // Raids endpoints
        server.get('/raids', Controllers.Raid.GetAll);
        server.get('/raids/:id', Controllers.Raid.Get);
        server.get('/raids/:id/encounters', Controllers.Raid.GetEncounters)
        server.get('/raids/refresh', Controllers.Raid.RefreshRaids);

        // Events
        server.get('/events', Controllers.Event.GetAll);
        server.post('/events', Controllers.Event.Create);
        server.get('/events/:id', Controllers.Event.Get);
        server.put('/events/:id', Controllers.Event.Update);
        server.del('/events/:id', Controllers.Event.Delete);

        // Compositions
        server.post('/compositions', Controllers.Composition.Create);
        server.get('/compositions/:event', Controllers.Composition.Get);
        server.get('/compositions/:event/:encounter', Controllers.Composition.Get);

        // Notes
        server.post('/notes', Controllers.Note.Create);
        server.put('/notes/:id', Controllers.Note.Update);
        server.del('/notes/:id', Controllers.Note.Delete);
        server.get('/notes/favorites', Controllers.Note.Favorites);

        // Stats
        server.get('/stats/ilvl', Controllers.Stat.AvgIlvl);
        server.get('/stats/azerite', Controllers.Stat.AvgAzerite);
        server.get('/stats/weekly', Controllers.Stat.WeeklyDone);

        // Blizzard
        server.get('/blizzard/realms', Controllers.Blizzard.Realms);

        // Options
        server.get('/options', Controllers.Option.Get);
        server.post('/options', Controllers.Option.Create);

        // Queues endpoints
        server.get('/queues/character/:id', (req, res, next) => {
            Queues.character.add({ character: req.params.id });
            res.send('Done');
            next();
        });

        server.get('/queues/weekly/:id', (req, res, next) => {
            Queues.weekly.add({ character: req.params.id });
            res.send('Done');
            next();
        });

        server.listen(Config.server.port, () => {
            Logger.info(`Server listening at ${server.url}`);

            // We start Socket.IO
            require('./utils/Socket').Init(server);
        });

        // We start CRONs
        require('./utils/Crons')();

        // We start Jobs
        Jobs.Start();
    });