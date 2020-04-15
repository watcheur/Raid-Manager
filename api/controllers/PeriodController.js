const TypeORM = require('typeorm');
const PeriodEntity = require('../entity/Period');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

class PeriodController extends DefaultController  {
    Get = (req, res, next) => {
        Logger.info('Retrieve boss informations', req.params);

        TypeORM.getRepository(PeriodEntity.name).createQueryBuilder()
            .where("id = :id", { id : req.params.id })
            .getOne()
            .then((el) => {
                if (el == null) {
                    Logger.info('Period not found');
                    return next(new Errs.NotFoundError('Period not found'));
                }

                res.send({
                    err: false,
                    data: el
                })
            })
            .catch(err => {
                Logger.error('Period retrieve failed', { id: req.params.id });
                next(new Errs.InternalError('Period retrieve failed'));
            })
    }

    GetAll = (req, res, next) => {

    }

    GetCurrent = (req, res, next) => {

    }

    RefreshPeriods = (req, res, next) => {

        TypeORM.getRepository(PeriodEntity.name)
            .createQueryBuilder()
            .select('MAX(id) as max_id')
            .getRawOne()
            .then(p => {
                let max_id = 0;
                if (p != null )
                    max_id = p.max_id;

                blizzard
                    .getApplicationToken()
                    .then(response => {
                        blizzard.defaults.token = response.data.access_token;
    
                        let params = {
                            locale: 'fr_FR',
                            namespace: 'dynamic'
                        }

                        blizzard.get('/data/wow/mythic-keystone/period/index', params)
                            .then(periodsResponse => {
                                let promises = [];

                                periodsResponse.data.periods.forEach(period => {
                                    if (period.id > max_id) {
                                        promises.push(new Promise((resolve, reject) => {
                                            blizzard.get(`/data/wow/mythic-keystone/period/${period.id}`, params)
                                                .then(periodResponse => {
                                                    console.log(periodResponse.data);
                                                    resolve({
                                                        id : periodResponse.data.id,
                                                        start: new Date(periodResponse.data.start_timestamp),
                                                        end: new Date(periodResponse.data.end_timestamp)
                                                    })
                                                })
                                                .catch(err => reject(err));
                                        }));
                                    }
                                });

                                Promise.all(promises).then(values => {
                                    TypeORM
                                        .getRepository(PeriodEntity.name)
                                        .save(values)
                                        .then(saved => {
                                            res.send({
                                                err: false,
                                                data : values
                                            });
                                            next();
                                        })
                                        .catch((err) => {
                                            Logger.error("Error occured while saving periods id", err)
                                            next(new Errs.InternalError('Database error'))
                                        });
                                });
                            })
                            .catch(err => {
                                Logger.error("Blizzard API error", err)
                                next(new Errs.InternalError('Blizzard API error'))
                            })
                    });
            })
            .catch(err => {
                Logger.error("Error occured on retrieving max period id", err)
                next(new Errs.InternalError('Database error'))
            });
    }
}

module.exports = PeriodController;