const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);
const Logger = require('../utils/Logger');
const Errs = require('restify-errors');

function Drops(id, cb) {
    Logger.info('Load items for encounter : ', id);

    if (!cb)
        cb = () => {};

    blizzard
        .getApplicationToken()
        .then(response => {
            blizzard.defaults.token = response.data.access_token;

            let params = {
                locale: 'en_GB',
                namespace: 'static'
            }

            const repo = TypeORM.getRepository(Entities.Item);

            blizzard.get(`/data/wow/journal-encounter/${id}`, params)
                .then(response => {
                    let promises = [];

                    response.data.items.map(i => i.item).forEach(item => {
                        promises.push(new Promise((resolve, reject) => {
                            repo.findOne({
                                relations: [ 'source' ],
                                where: {
                                    id: item.id
                                }
                            })
                            .then(savedItem => {
                                if (savedItem)
                                {
                                    if (!savedItem.source) {
                                        repo
                                            .createQueryBuilder()
                                            .update(Entities.Item)
                                            .set({ source: id })
                                            .where("id = :id", { id: item.id })
                                            .execute()
                                    }
                                }
                                else
                                {
                                    repo.save({
                                        id: item.id,
                                        name: item.name,
                                        source: id,
                                        created: new Date()
                                    });
                                }
                                resolve(item);
                            })
                            .catch(err => {
                                reject(err);
                            })
                        }));
                    });

                    Promise.all(promises)
                        .then(values => {
                            cb();
                        })
                        .catch(err => {
                            Logger.error("Promise error", err)
                            cb(new Errs.InternalError('Blizzard API failed error'))
                        })
                })
                .catch(err => {
                    Logger.error("Blizzard instances API error", err)
                    cb(new Errs.InternalError('Blizzard API error'))
                })
        })
        .catch(err => {
            Logger.error("Blizzard token retrieve failed", err)
            cb(new Errs.InternalError('Blizzard API failed'))
        })
}

module.exports = {
    LoadDrops: (encounter, done) => Drops(encounter, done)
}