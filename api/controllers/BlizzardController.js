const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

class BlizzardController extends DefaultController  {
    Realms = (req, res, next) => {
        let reqs = [];
        try {
            reqs = this.ClearProps(req.query, [ 'category' ])
        }
        catch (err) { return next(err) };

        TypeORM.getRepository(Entities.Realm)
            .find({
                where: reqs,
                order: {
                    category: 'ASC',
                    name: 'ASC'
                }
            })
            .then(realms => {
                res.send({ err: false, data: realms })
            })
            .catch(err => {
                Logger.error('Realms get error', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    LoadRealms = (req, res, next) => {
        const repo = TypeORM.getRepository(Entities.Realm);

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
                        namespace: 'dynamic'
                    }
    
                    blizzard.get('/data/wow/connected-realm/index', params)
                        .then(realmsResponse => {
                            let promises = [];

                            realmsResponse.data.connected_realms.map(r => r.href.match(/\d+/g)).filter(id => ids.indexOf(id) < 0).forEach(realm => {
                                promises.push(new Promise((resolve, reject) => {
                                    blizzard.get(`/data/wow/connected-realm/${realm}`, params)
                                        .then(realmResponse => {
                                            resolve(realmResponse.data.realms.map(r => { return {
                                                id: r.id,
                                                name: r.name,
                                                slug: r.slug,
                                                category: r.category
                                            } }));
                                        })
                                        .catch(err => resolve(null));
                                }));
                            });

                            Promise.all(promises)
                                .then(values => {

                                    const realms = [].concat.apply([], values);

                                    repo
                                        .save(realms)
                                        .then(saved => {
                                            if (res)
                                            res.send({ err: false, data : saved });
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
                            Logger.error("Blizzard realm API error", err)
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

module.exports = BlizzardController;