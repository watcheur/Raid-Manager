const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);
const Context = require('../utils/Context');

class ExpansionController extends DefaultController  {
    Get = (req, res, next) => {
        TypeORM.getRepository(Entities.Expansion)
            .findOne({
                relations: [ "raids" ],
                where: {
                    id: Context.CurrentExpansion.id
                }
            })
            .then(exp => {
                res.send({
                    err: false,
                    data: exp
                });
                next();
            })
            .catch(err => {
                Logger.error('Error retrieving current expansion', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    GetAll = (req, res, next) => {
        TypeORM.getRepository(Entities.Expansion)
            .find({
                relations: [ "raids" ]
            })
            .then(exps => {
                res.send({
                    err: false,
                    data: exps
                });
                next();
            })
            .catch(err => {
                Logger.error('Error retrieving current expansion', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    Refresh = (req, res, next) => {
        const repo = TypeORM.getRepository(Entities.Expansion);

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
    
                    blizzard.get('/data/wow/journal-expansion/index', params)
                        .then(instancesResponse => {
                            const xpacs = instancesResponse.data.tiers.filter(t => ids.indexOf(t.id) < 0).map(t => { return { name: t.name, id: t.id } })

                            repo
                                .save(xpacs)
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

module.exports = ExpansionController;