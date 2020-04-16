const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

class RaidController extends DefaultController {
    Get = (req, res, next) => {

    }

    GetAll = (req, res, next) => {

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
                                            })
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