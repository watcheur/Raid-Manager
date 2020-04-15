const Typeorm = require('typeorm');
const CharacterEntity = require('../entity/Character');
const WeeklyEntity = require('../entity/Weekly');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class WeeklyController extends DefaultController {
    Get = (req, res, next) => {
        Logger.info('Retrieve weekly chest', req.params);

        Typeorm.getRepository(WeeklyEntity.name).createQueryBuilder()
        .where("id = :id", { id : req.params.id })
        .getOne()
        .then((el) => {
            if (el == null) {
                Logger.info('Weekly not found');
                return next(new Errs.NotFoundError('This weekly not found'));
            }

            res.send({
                err: false,
                data: el
            })
        })
        .catch(err => {
            Logger.error('Weekly retrieve failed', { id: req.params.id });
            next(new Errs.InternalError('Weekly retrieve failed'));
        })
    }

    Create = (req, res, next) => {
        Logger.info('Start creating weekly chest', req.body);
        this.RequiredProps(req.body, [ 'period', 'level', 'zone', 'timed', 'timestamp', 'character' ]);

        var weekly = {
            period: req.body.period,
            level: req.body.level,
            zone: req.body.zone,
            timed: req.body.timed,
            timestamp: req.body.timestamp,
            character: req.body.character
        };

        const repo = Typeorm.getRepository(WeeklyEntity.name);

        repo.createQueryBuilder()
            .where("level = :level AND timed = :timed AND characterId = :character AND period = :period AND zone = :zone AND timestamp = :timestamp", weekly)
            .getCount()
            .then((nb) => {
                if (nb > 0) {
                    Logger.info('This weekly dungeon is already saved');
                    return next(new Errs.BadRequestError('This weekly dungeon is already saved'));
                }

                Typeorm.getRepository(CharacterEntity.name)
                    .createQueryBuilder()
                    .where('id = :id', { id: weekly.character })
                    .getCount()
                    .then(charCount => {
                        if (charCount == 0)
                            return next(new Errs.NotFoundError('Character not found'));

                        repo
                            .save(weekly)
                            .then((saved) => {
                                res.send({
                                    err: false,
                                    data: saved
                                })
                                Logger.info('Weekly creation ended');
                                next();
                            })
                            .catch(err => {
                                Logger.error('Weekly save failed', { id: id, weekly: weekly })
                                next(new Errs.InternalError('Weekly save failed'))
                            });
                    })
                    .catch(err => {
                        Logger.error('Char Count verification failed', { id: weekly.character });
                        next(new Errs.InternalError('Char Count verification failed'));
                    })
            })
            .catch(err => {
                Logger.error('Weekly Count verification failed', { weekly: weekly });
                next(new Errs.InternalError('Weekly Count verification failed'));
            })
    }

    Update = (req, res, next) => {
        Logger.info('Start weekly update', { id: req.params.id, body: req.body });
        const repo = Typeorm.getRepository(CharacterEntity.name);
        const props = [ 'level', 'timed', 'period', 'zone', 'timestamp' ];

        let update = {};
        props.forEach((p) => {
            if (req.body.hasOwnProperty(p))
                update[p] = req.body[p]
        });

        repo
            .createQueryBuilder("w")
            .where("w.id = :id", { id: req.params.id })
            .getOne()
            .then((weekly) => {
                if (weekly == null)
                    return next(new Errs.NotFoundError('Character not found'));

                    repo
                        .createQueryBuilder()
                        .update(WeeklyEntity.name)
                        .set(update)
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .then(query => {
                            Logger.info('Weekly update done', { char: req.params.id })
                            res.send({ err: false, data: Object.assign(weekly, update) })
                            next();
                        })
                        .catch(err => {
                            Logger.error('Weekly update query error', err);
                            next(new Errs.InternalError('Weekly update query error'));
                        })
            })
            .catch(err => {
                Logger.error('Character update - Search failed', err);
                next(new Errs.InternalError());
            })
    }

    Delete = (req, res, next) => {
        Logger.info("Weekly deletion", req.params.id);

        Typeorm.getConnection()
            .createQueryBuilder()
            .delete()
            .from(WeeklyEntity.name)
            .where('id = :id', { id : req.params.id })
            .execute()
            .then((deleted) => {
                if (deleted.affected == 0)
                    return next(new Errs.NotFoundError('This weekly encounter wasn\'t found'));

                res.send({
                    err: false,
                    data: true
                })
                Logger.info('Weekly deleted');
                next();
            })
            .catch(err => {
                Logger.error('Weekly deletion failed', { id: id })
                next(new Errs.InternalError('Weekly deletion failed'))
            });
    }
}

module.exports = WeeklyController;