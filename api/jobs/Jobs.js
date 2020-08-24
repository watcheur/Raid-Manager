const Logger = require('../utils/Logger');
const Queues = require('../utils/Queues');
const CharacterJobs = require('./CharacterJobs');
const WeeklyJobs = require('./WeeklyJobs');
const ItemJobs = require('./ItemJobs');
const EncounterJobs = require('./EncounterJobs');

module.exports = {
    Start: () => {
        Logger.info('Sarting character queue processing');
        Queues.Character.process((job, done) => {
            if (!job.data.character)
                return done(null, null);

            CharacterJobs.Update(job.data.character, done);
        }).catch(err => { Logger.error('Character queue processing failed'); })

        Logger.info('Starting weekly queue processing');
        Queues.Weekly.process((job, done) => {
            if (!job.data.character)
                return done(null, null);
            WeeklyJobs.Update(job.data.character, done);
        }).catch(err => { Logger.error('Weekly queue processing failed '); })

        Logger.info('Starting item queue processing');
        Queues.Item.process((job, done) => {
            if (!job.data.item)
                return done(null, null);
            
            ItemJobs.Update(job.data.item, done);
        });

        Logger.info('Starting encounter queue processing');
        Queues.Encounter.process((job, done) => {
            console.log("ok", job.data);
            if (!job.data.encounter)
                return done(null, null);

            EncounterJobs.LoadDrops(job.data.encounter, done);
        });
    },
    Character: CharacterJobs,
    Weekly: WeeklyJobs,
    Item: ItemJobs,
    Encounter: EncounterJobs
}