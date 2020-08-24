const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const Queues = require('../utils/Queues');
const DefaultController = require('./DefaultController');
const EncounterController = require('./EncounterController');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

class RaidController extends DefaultController {
    Get = (req, res, next) => {
        TypeORM.getRepository(Entities.Raid)
        .findOne({
            relations: [ "encounters", "expansion" ],
            where: {
                id: req.params.id
            }
        })
        .then(raid => {
            res.send({
                err: false,
                data: raid
            });
            next();
        })
        .catch(err => {
            Logger.error('Error retrieving raid', err);
            next(new Errs.InternalError('Database error'));
        })
    }

    GetAll = (req, res, next) => {
        Logger.info('Raids search', req.params);
        const reqs = this.ClearProps(req.query, [ 'name', 'expansion', 'level' ]);
        Logger.info('Raids search found params: ', reqs);

        if (reqs['name'])
            reqs['name'] = TypeORM.Like(`%${reqs['name']}%`)

        TypeORM.getRepository(Entities.Raid)
            .find({
                relations: [ "encounters", "expansion" ],
                where: reqs
            })
            .then(raids => {
                res.send({
                    err: false,
                    data: raids
                });
                next();
            })
            .catch(err => {
                Logger.error('Error retrieving raids', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    GetEncounters = (req, res, next) => {
        Logger.info('Raid encounters search', req.params);
        const reqs = this.ClearProps(req.query, [ 'name' ]);
        Logger.info('Raid encounters found params: ', reqs);

        if (reqs['name'])
            reqs['name'] = TypeORM.Like(`%${reqs['name']}%`)
        reqs.raid = req.params.id;

        TypeORM.getRepository(Entities.Encounter)
            .find({
                where: reqs,
                order: {
                    order: 'ASC'
                }
            })
            .then(encounters => {
                res.send({
                    err: false,
                    data: encounters
                });
                next();
            })
            .catch(err => {
                Logger.error('Error retrieving raids', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    RefreshRaids = (req, res, next) => {
        const repo = TypeORM.getRepository(Entities.Raid);

        repo
            .createQueryBuilder()
            .select('DISTINCT id', 'id')
            .getRawMany()
            .then(ids => {
                blizzard
                .getApplicationToken()
                .then(response => {
                    blizzard.defaults.token = response.data.access_token;
    
                    let params = {
                        locale: 'en_GB',
                        namespace: 'static'
                    }
    
                    blizzard.get('/data/wow/journal-instance/index', params)
                        .then(instancesResponse => {
                            let promises = [];
    
                            instancesResponse.data.instances.filter(i => ids.indexOf(i.id) < 0).forEach(instance => {
                                promises.push(new Promise((resolve, reject) => {
                                    blizzard.get(`/data/wow/journal-instance/${instance.id}`, params)
                                        .then(instanceResponse => {
                                            if (instanceResponse.data.category.type !== 'RAID')
                                                return resolve(null);
                                            
                                            resolve({
                                                id : instanceResponse.data.id,
                                                name: instanceResponse.data.name,
                                                expansion: instanceResponse.data.expansion.id,
                                                minimum_level: instanceResponse.data.minimum_level,
                                                encounters: instanceResponse.data.encounters.map(e => { return { id: e.id, name: e.name } })
                                            });
                                        })
                                        .catch(err => resolve(null));
                                }));
                            });

                            Promise.all(promises)
                                .then(values => {
                                    const raids = values.filter(v => v != null);

                                    repo
                                        .save(raids)
                                        .then(saved => {
                                            res.send({
                                                err: false,
                                                data : saved
                                            });

                                            saved.forEach(r => r.encounters.forEach(ec => {
                                                Queues.Encounter.add({ encounter: ec.id });
                                            }));

                                            next();
                                        })
                                        .catch((err) => {
                                            Logger.error("Error occured while saving periods id", err)
                                            next(new Errs.InternalError('Database error'))
                                        });
                                })
                                .catch(err => {
                                    console.log(err);
                                    Logger.error("Promise error", err)
                                    next(new Errs.InternalError('Blizzard API failed error'))
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            Logger.error("Blizzard instances API error", err)
                            next(new Errs.InternalError('Blizzard API error'))
                        })
                })
                .catch(err => {
                    Logger.error("Blizzard token retrieve failed", err)
                    next(new Errs.InternalError('Blizzard API failed'))
                })
            })
            .catch(err => {
                Logger.error("Error occured while fetching raid's ids", err)
                next(new Errs.InternalError('Database error'))
            })
    }
}

module.exports = RaidController;