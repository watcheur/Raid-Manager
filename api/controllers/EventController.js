const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const Utils = require('../utils/Utils');
const Socket = require('../utils/Socket');

class EventController extends DefaultController  {
    GetAll = (req, res, next) => {
        Logger.info('Start get all events method');

        TypeORM
            .getRepository(Entities.Event)
            .find({
                relations: [ 'raid' ],
                order: {
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
                relations: [ 'raid', 'compositions', 'compositions.encounter', 'compositions.characters', 'compositions.characters.character' ],
                where: {
                    id: req.params.id
                }
            })
            .then(ev => {
                if (ev == null)
                    return next(new Errs.NotFoundError('Event not found'));
                ev.compositions = ev.compositions.map(c => c.characters = Utils.TransformsCharCompToChar(c.characters));
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

        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'title', 'schedule', 'raid', 'difficulty' ]);
        } catch (err) {
            return next(err);
        }

        TypeORM.getRepository(Entities.Raid)
            .createQueryBuilder()
            .where('id = :id', { id: props.raid })
            .getCount()
            .then(cR => {
                if (cR == 0 )
                    return next(new Errs.NotFoundError('This event doesn\'t exist'));

                const repo = TypeORM.getRepository(Entities.Event);

                props.schedule = new Date(props.schedule);
                if (isNaN(props.schedule.getTime()))
                    return next(new Errs.BadRequestError('Invalid date format'));

                repo
                    .createQueryBuilder()
                    .where('schedule = :schedule AND raid = :raid', { schedule: props.schedule, raid: props.raid })
                    .getCount()
                    .then(c => {
                        if (c > 0)
                            return next(new Errs.BadRequestError('This event already exist (same raid & same time)'));

                        repo
                            .save({
                                title: props.title,
                                schedule: props.schedule,
                                difficulty: props.difficulty,
                                raid: props.raid,
                                created: new Date()
                            })
                            .then(ev => {
                                res.send({
                                    err: false,
                                    data: ev
                                })
                                Socket.Emit(Socket.Channels.Event, {
                                    action: Socket.Action.Event.Create,
                                    data: {
                                        event: ev.id
                                    }
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

    Update = async (req, res, next) => {
        Logger.info('Start event update', { id: req.params.id, body: req.body });
        const repo = TypeORM.getRepository(Entities.Event);
        const update = this.ClearProps(req.body, [ 'title', 'schedule', 'raid', 'difficulty' ]);
        const eventId = req.params.id;

        update.updated = new Date();

        if (update.raid) {
            try {
                let raid = await TypeORM.getRepository(Entities.Raid).findOne({ where: { id: update.raid } });
                if (raid === undefined)
                    return next(new Errs.NotFoundError('Raid not found'));
                }
            catch (err) {
                Logger.error('Raid verify db error', err);
                return next(new Errs.InternalError('Database error'));
            }
        }

        repo
            .createQueryBuilder()
            .where('id = :id', { id : eventId })
            .getOne()
            .then(ev => {
                if (ev == null)
                    return next(new Errs.NotFoundError('Event not found'));

                repo
                    .createQueryBuilder()
                    .update(Entities.Event)
                    .set(update)
                    .where('id = :id', { id: eventId })
                    .execute()
                    .then(query => {
                        if (update.raid && update.raid != ev.raid) {
                            // Since the raid have changed, we remove comps
                            TypeORM.getConnection()
                                .createQueryBuilder()
                                .delete()
                                .from(Entities.Composition)
                                .where('event = :event', { event: eventId })
                                .execute()
                                .then(deleted => {
                                    res.send({
                                        err: false,
                                        data: Object.assign(ev, update)
                                    })
                            
                                    Socket.Emit(Socket.Channels.Event, {
                                        action: Socket.Action.Event.Update,
                                        data: {
                                            event: ev.id
                                        }
                                    })

                                    next();
                                })
                                .catch(err => {
                                    Logger.error('Event update, composition deletion error', err);
                                    res.send({
                                        err: false,
                                        data: Object.assign(ev, update)
                                    })
                                    next();
                                })
                        }
                        else {
                            res.send({
                                err: false,
                                data: Object.assign(ev, update)
                            })
                            
                            Socket.Emit(Socket.Channels.Event, {
                                action: Socket.Action.Event.Update,
                                data: {
                                    event: ev.id
                                }
                            })

                            next();
                        }
                    })
                    .catch(err => {
                        Logger.error('Event update error', err);
                        next(new Errs.InternalError('Database error'));
                    })
            })
            .catch(err => {
                Logger.error('Event get error', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    Delete = (req, res, next) => {
        Logger.info("Event deletion", req.params.id);

        TypeORM.getConnection()
            .createQueryBuilder()
            .delete()
            .from(Entities.Event)
            .where('id = :id', { id : req.params.id })
            .execute()
            .then((deleted) => {
                if (deleted.affected == 0)
                    return next(new Errs.NotFoundError('Event not found'));

                res.send({
                    err: false,
                    data: true
                })

                Socket.Emit(Socket.Channels.Event, {
                    action: Socket.Action.Event.Delete,
                    data: {
                        event: req.params.id
                    }
                });

                Logger.info('Event deleted');
                next();
            })
            .catch(err => {
                Logger.error('Event deletion failed', err)
                next(new Errs.InternalError('Event deletion failed'))
            });
    }

    Duplicate = (req, res, next) => {
        Logger.info('Duplicate event', req.params, req.body);

        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'schedule' ]);
        } catch (err) {
            return next(err);
        }

        var repo = TypeORM.getRepository(Entities.Event);
        
        repo
            .findOne({
                relations: [ 'raid', 'compositions', 'compositions.encounter', 'compositions.characters', 'compositions.characters.character' ],
                where: {
                    id: req.params.id
                }
            })
            .then(originalEvent => {
                if (originalEvent == null)
                    return next(new Errs.NotFoundError('Event not found'));

                originalEvent.schedule = new Date(props.schedule);
                if (isNaN(originalEvent.schedule.getTime()))
                    return next(new Errs.BadRequestError('Invalid date format'));

                repo
                    .createQueryBuilder()
                    .where('schedule = :schedule AND raid = :raid', { schedule: originalEvent.schedule, raid: originalEvent.raid.id })
                    .getCount()
                    .then(c => {
                        if (c > 0)
                            return next(new Errs.BadRequestError('This event already exist (same raid & same time)'));

                        repo
                            .save({
                                title: originalEvent.title,
                                schedule: originalEvent.schedule,
                                difficulty: originalEvent.difficulty,
                                raid: originalEvent.raid,
                                created: new Date()
                            })
                            .then(newEvent => {

                                var comps = originalEvent.compositions.map(cmp => {
                                    return {
                                        event: newEvent.id,
                                        created: new Date(),
                                        encounter: cmp.encounter.id,
                                        characters: cmp.characters.map(c => {
                                            return {
                                                role: c.role,
                                                character: c.character.id
                                            }
                                        })
                                    }
                                });

                                TypeORM.getRepository(Entities.Composition).save(comps)
                                    .then(saved => {
                                        newEvent.compositions = comps;

                                        var charComps = [].concat.apply([], saved.map(sv => {
                                            return sv.characters.map(c => {
                                                c.composition = sv.id;
                                                return c;
                                            })
                                        }));

                                        TypeORM.getRepository(Entities.CharacterComp).save(charComps)
                                            .then(saved => {
                                                res.send({
                                                    err: false,
                                                    data: newEvent
                                                })
        
                                                Socket.Emit(Socket.Channels.Event, {
                                                    action: Socket.Action.Event.Create,
                                                    data: {
                                                        event: newEvent.id
                                                    }
                                                })
                                                next();
                                            })
                                            .catch(err => {
                                                Logger.error('Composition save error', err);
                                                next(new Errs.InternalError('Database error'));
                                            })
                                    })
                                    .catch(err => {
                                        Logger.error('Composition save error', err);
                                        next(new Errs.InternalError('Database error'));
                                    })
                                
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
                Logger.error('Events retrieve error', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    NextEvent = (req, res, next) => {
        Logger.info('Start get next event');

        TypeORM
            .getRepository(Entities.Event)
            .findOne({
                relations: [ 'raid' ],
                where: {
                    schedule: TypeORM.MoreThanOrEqual(new Date())
                },
                order: {
                    schedule: 'ASC'
                }
            })
            .then(event => {
                res.send({
                    err: false,
                    data: event
                });
                Logger.info('End get closest event method');
                next()
            })
            .catch(err => {
                Logger.error('Events retrieve error', err);
                next(new Errs.InternalError('Database error'));
            })
    }
}

module.exports = EventController;