const Logger = require('../utils/Logger');
const Queues = require('../utils/Queues');
const CharacterJobs = require('./CharacterJobs');
const WeeklyJobs = require('./WeeklyJobs');

module.exports = {
    Start: () => {
        Logger.info('Sarting character queue processing');
        Queues.Character.process((job, done) => {
            CharacterJobs.Update(job.data.character, done);
        }).catch(err => { Logger.error('Character queue processing failed'); })

        Logger.info('Starting weekly queue processing');
        Queues.Weekly.process((job, done) => {
            WeeklyJobs.Update(job.data.character, done);
        }).catch(err => { Logger.error('Weekly queue processing failed '); })
    },
    Character: CharacterJobs,
    Weekly: WeeklyJobs
}