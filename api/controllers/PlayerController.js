const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const Socket = require('../utils/Socket');

class PlayerController extends DefaultController  {
    GetAll = (req, res, next) => {
        Logger.info('Players search', req.params);
        const reqs = this.ClearProps(req.query, [ 'name' ]);
        Logger.info('Players search found params: ', reqs);

        if (reqs['name'])
            reqs['name'] = TypeORM.Like(`%${reqs['name']}%`)

            TypeORM.getRepository(Entities.Player)
                .find({
                    where: reqs
                })
                .then(players => {
                    res.send({err: false, data: players });
                    Logger.info('Players search end');
                    next();
                })
                .catch(err => {
                    Logger.error('Player retrieve failed', err);
                    next(new Errs.InternalError('Player retrieve failed'));
                })
    }

    Get = (req, res, next) => {
        Logger.info('Retrieve player', req.params);

        TypeORM.getRepository(Entities.Player)
            .findOne({
                where: {
                    id: req.params.id
                }
            })
            .then(player => {
                if (!player) {
                    Logger.info('Player not found');
                    return next(new Errs.NotFoundError('Player not found'));
                }

                res.send({
                    err: false,
                    data: player
                })
            })
            .catch(err => {
                console.log(err);
                Logger.error('Player retrieve failed', { id: req.params.id });
                next(new Errs.InternalError('Player retrieve failed'));
            })
    }

    Create = (req, res, next) => {
        Logger.info('Start player create', req.body);

        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'name' ]);
        } catch (err) {
            return next(err);
        }

        const repo = TypeORM.getRepository(Entities.Player);

        repo.findOne({ where: { name: props.name }})
            .then(pl => {
                if (pl) {
                    Logger.info('Player already exist');
                    return next(new Errs.BadRequestError('Player already exist'));
                }

                repo.save(props)
                    .then(saved => {
                        res.send({
                            err: false,
                            data: saved
                        });

                        Logger.info('End player create', req.body);
                        next()
                    })
            })
            .catch(err => {
                console.log(err);
                Logger.error('Player create failed', req.body);
                next(new Errs.InternalError('Player create failed'));
            })
    }

    Update = (req, res, next) => {
        Logger.info('Start player update', req.body);

        let update = {};
        try {
            update = this.RequiredProps(req.body, [ 'name' ]);
        } catch (err) {
            return next(err);
        }

        const repo = TypeORM.getRepository(Entities.Player);
        repo.findOne({ where: { id: req.params.id }})
            .then(upres => {
                if (!upres)
                    return next(new Errs.NotFoundError('Player not found'));

                repo
                    .createQueryBuilder()
                    .update(Entities.Player)
                    .set(update)
                    .where("id = :id", { id: req.params.id })
                    .execute()
                    .then(saved => {
                        res.send({
                            err: false,
                            data: saved
                        });

                        Logger.info('End player update', req.body);
                        next()
                    })
            })
            .catch(err => {
                console.log(err);
                Logger.error('Player update failed', req.body);
                next(new Errs.InternalError('Player update failed'));
            })
    }

    Delete = (req, res, next) => {
        Logger.info("Player deletion", req.params.id);

        TypeORM.getConnection()
            .createQueryBuilder()
            .delete()
            .from(Entities.Player)
            .where('id = :id', { id : req.params.id })
            .execute()
            .then((deleted) => {
                if (deleted.affected == 0)
                    return next(new Errs.NotFoundError('Player not found'));

                res.send({
                    err: false,
                    data: true
                })

                Logger.info('Player deleted');
                next();
            })
            .catch(err => {
                Logger.error('Player deletion failed', err)
                next(new Errs.InternalError('Player deletion failed'))
            });
    }
}

module.exports = PlayerController;