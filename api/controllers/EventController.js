const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class EventController extends DefaultController  {
    GetAll = (req, res, next) => {
        Logger.info('Start get all events method');

        TypeORM
            .getRepository(Entities.Event)
            .find({
                relations: [ 'raid' ],
                orderBy: {
                    schedule: 'DESC'
                },
                limit: 30
            })
            .then(events => {
                res.send({
                    err: false,
                    data: events
                });
                Logger.info('End get all events method');
                next()
            })
            .catch(err => {
                Logger.error('Events retrieve error', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    Get = (req, res, next) => {
        Logger.info('Get given event method', req.params);
        
        TypeORM
            .getRepository(Entities.Event)
            .findOne({
                relations: [ 'raid', 'compositions', 'compositions.encounter' ],
                where: {
                    id: req.params.id
                }
            })
            .then(ev => {
                if (ev == null)
                    return next(new Errs.NotFoundError('Event not found'));
                
                res.send({
                    err: false,
                    data: ev
                });
                Logger.info('End get given event method', req.params);
                next()
            })
            .catch(err => {
                Logger.error('Events retrieve error', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    Create = (req, res, next) => {
        Logger.info('Start character create', req.body);

        try {
            this.RequiredProps(req.body, [ 'title', 'schedule', 'raid' ]);
        } catch (err) {
            return next(err);
        }

        TypeORM.getRepository(Entities.Raid)
            .createQueryBuilder()
            .where('id = :id', { id: req.body.raid })
            .getCount()
            .then(cR => {
                if (cR == 0 )
                    return next(new Errs.NotFoundError('This raid doesn\'t exist'));

                const repo = TypeORM.getRepository(Entities.Event);

                req.body.schedule = new Date(req.body.schedule);
                if (isNaN(req.body.schedule.getTime()))
                    return next(new Errs.BadRequestError('Invalid date format'));

                repo
                    .createQueryBuilder()
                    .where('schedule = :schedule AND raid = :raid', { schedule: req.body.schedule, raid: req.body.raid })
                    .getCount()
                    .then(c => {
                        if (c > 0)
                            return next(new Errs.BadRequestError('This event already exist (same raid & same time)'));

                        repo
                            .save({
                                title: req.body.title,
                                schedule: req.body.schedule,
                                raid: req.body.raid,
                                created: new Date()
                            })
                            .then(ev => {
                                res.send({
                                    err: false,
                                    data: ev
                                })
                                next();
                            })
                            .catch(err => {
                                Logger.error('Events save error', err);
                                next(new Errs.InternalError('Database error'));
                            })
                    })
                    .catch(err => {
                        Logger.error('Events retrieve error', err);
                        next(new Errs.InternalError('Database error'));
                    });
            })
            .catch(err => {
                Logger.error('Events save error', err);
                next(new Errs.InternalError('Database error'));
            })
    }
}

module.exports = EventController;