const Typeorm = require('typeorm');
const CharacterEntity = require('../entity/Character');
const WeeklyEntity = require('../entity/Weekly');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);
const Logger = require('../utils/Logger');

function WeeklyUpdate(id, cb) {
    Logger.info('Start Character weekly (mythic+) update job', { char: id })

    const repo = Typeorm.getRepository(CharacterEntity.name);

    repo
        .createQueryBuilder("c")
        .where("c.id = :id", { id: id })
        .getOne()
        .then((char) => {
            blizzard
                .getApplicationToken()
                .then(response => {
                    blizzard.defaults.token = response.data.access_token;

                    let params = {
                        access_token: blizzard.defaults.token,
                        locale: 'en_US',
                        namespace: 'profile-EU'
                    }

                    try
                    {
                        blizzard.wow.character('mythic-keystone-profile', { origin: 'eu', realm: char.realm, name: char.name.toLowerCase(), params: params })
                            .then(res => {
                                if (res.data.current_period.best_runs) {
                                    if (res.data.current_period.best_runs.length == 0)
                                        return cb(null, { });

                                    const max = res.data.current_period.best_runs.reduce((prev, current) => {
                                        if (prev.keystone_level == current.keystone_level)
                                            return (prev.is_completed_within_time ? prev : current);
                                        return (prev.keystone_level > current.keystone_level) ? prev : current
                                    });
                                }
                                else
                                    return cb(null, { });

                                var weekly = {
                                    period: res.data.current_period.period.id,
                                    level: max.keystone_level,
                                    zone: max.dungeon.id,
                                    timed: max.is_completed_within_time,
                                    timestamp: max.completed_timestamp,
                                    character: id
                                };

                                var repo = Typeorm.getRepository(WeeklyEntity.name);

                                Logger.info('Found this weekly', weekly);
                                repo.createQueryBuilder()
                                .where("level = :level AND timed = :timed AND characterId = :character AND period = :period AND zone = :zone AND timestamp = :timestamp", weekly)
                                .getCount()
                                .then((nb) => {
                                    if (nb > 0) {
                                        Logger.info('This weekly dungeon is already saved');
                                        return cb(null, weekly);
                                    }

                                    repo
                                        .save(weekly)
                                        .then((field) => {
                                            cb(null, field);
                                        })
                                        .catch(err => {
                                            Logger.error('Weekly save failed', { id: id, weekly: weekly })
                                            cb(new Error('Weekly save failed'))
                                        });
                                })
                                .catch(err => {
                                    Logger.error('Weekly Count verification failed', { weekly: weekly });
                                    cb(new Error('Weekly Count verification failed'));
                                })
                            })
                            .catch(err => {
                                Logger.error('Blizzard API Mythic Keystone Profile failed', { status: err.response.status, statusText: err.response.statusText, character: { id: id, name: char.name, realm: char.realm } });
                                cb(new Error('Blizzard API Failed'));
                            });
                    }
                    catch (e)
                    {
                        Logger.error(e);
                        cb(e);
                    }
                })
                .catch(err => {
                    Logger.error('Blizzard token access failed', { status: err.response.status, statusText: err.response.statusText });
                    cb(new Error('Blizzard token access failed'));
                })
        })
        .catch(err => {
            cb(err);
        });
}

module.exports = {
    Update: (characterId, done) => WeeklyUpdate(characterId, done)
}