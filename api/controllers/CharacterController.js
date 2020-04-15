const Typeorm = require('typeorm');
const CharacterEntity = require('../entity/Character');
const WeeklyEntity = require('../entity/Weekly');
const Errs = require('restify-errors');
const Jobs = require('../utils/Jobs');
const Queues = require('../utils/Queues');
const Logger = require('../utils/Logger');
const Enums = require('../utils/Enums');
const Utils = require('../utils/Utils');
const DefaultController = require('./DefaultController');

class CharacterController extends DefaultController {
    GetAll = (req, res, next) => {
        Logger.info('Characters search', req.params);

        const reqs = this.ClearProps(req.query, [ 'name', 'realm', 'type', 'class', 'spec', 'role', 'equipped', 'avg', 'azerite', 'orderBy', 'orderDir', 'weekly', 'refresh', 'refreshWeekly' ]);
        Logger.info('Characters search found params: ', reqs);

        let p = Typeorm.getRepository(CharacterEntity.name)
        .createQueryBuilder("c")
        .orderBy('type', 'ASC')
        .addOrderBy(reqs['orderBy'] || 'name', reqs['orderDir'] || 'ASC')

        if (reqs['name'])
            p = p.where('c.name like :name', { name: `%${reqs['name']}%` });

        if (reqs['realm'])
            p = p.andWhere('c.realm like :realm', { realm: `%${reqs['realm']}%` });

        if (reqs['type'])
            p = p.andWhere('c.type = :type', { type: reqs['type'] });

        if (reqs['class'])
            p = p.andWhere('c.class = :class', { type: reqs['class'] });

        if (reqs['spec'])
            p = p.andWhere('c.spec = :spec', { spec: reqs['spec'] });

        if (reqs['role'])
            p = p.andWhere('c.spec IN (:role)', { role: Utils.GetSpecsByRole(reqs['role']) });

        if (reqs['equipped'])
            p = p.andWhere('c.equipped >= :equipped', { equipped: reqs['equipped'] });

        if (reqs['avg'])
            p = p.andWhere('c.avg >= :avg', { avg: reqs['avg'] });

        if (reqs['azerite'])
            p = p.andWhere('c.azerite >= :azerite', { azerite: reqs['azerite'] });

        p
        .getMany()
        .then((chars) => {
            res.send({
                err: false,
                data: chars
            })

            chars.forEach((c) => {
                if (reqs.refresh)
                    Queues.Character.add({ character: c.id });
                
                if (reqs.refreshWeekly)
                    Queues.Weekly.add({ character: c.id });
            });

            next();
        })
        .catch(err => {
            Logger.error('Character retrieve failed', { id: req.params.id });
            next(new Errs.InternalError('Character retrieve failed'));
        })
    }

    Get = (req, res, next) => {
        Logger.info('Retrieve character', req.params);

        Typeorm.getRepository(CharacterEntity.name)
        .createQueryBuilder("char")
        .where("char.id = :id", { id : req.params.id })
        .getOne()
        .then((el) => {
            if (el == null) {
                Logger.info('Character not found');
                return next(new Errs.NotFoundError('Character not found'));
            }

            res.send({
                err: false,
                data: el
            })
        })
        .catch(err => {
            console.log(err);
            Logger.error('Character retrieve failed', { id: req.params.id });
            next(new Errs.InternalError('Character retrieve failed'));
        })
    }

    Create = (req, res, next) => {
        Logger.info('Start character create', req.body);
        this.RequiredProps(req.body, [ 'name', 'realm', 'type' ]);

        const repo = Typeorm.getRepository(CharacterEntity.name);
        repo
            .createQueryBuilder("c")
            .where("c.name = :name AND c.realm = :realm", { name: req.body.name, realm: req.body.realm })
            .getCount()
            .then((nb) => {
                if (nb > 0)
                    return next(new Errs.BadRequestError('Character already registered'));

                repo
                    .save({ name: req.body.name, realm: req.body.realm, type: req.body.type, created: new Date() })
                    .then((char) => {
                        res.send({
                            err: false,
                            data: char
                        })

                        Queues.Character.add({ character: char.id });
                        Queues.Weekly.add({ character: char.id });

                        Logger.info('End character create', req.body);
                        next()
                    })
            })
            .catch(err => {
                Logger.error('Character create - Duplicate verification failed', err);
                next(new Errs.InternalError());
            })
    }

    Update = (req, res, next) => {
        Logger.info('Start character update', { id: req.params.id, body: req.body });
        const repo = Typeorm.getRepository(CharacterEntity.name);
        const props = [ 'type' ];

        let update = {};
        props.forEach((p) => {
            if (req.body.hasOwnProperty(p))
                update[p] = req.body[p]
        });

        repo
            .createQueryBuilder("c")
            .where("c.id = :id", { id: req.params.id })
            .getOne()
            .then((char) => {
                if (char == null)
                    return next(new Errs.NotFoundError('Character not found'));

                    repo
                        .createQueryBuilder()
                        .update(CharacterEntity.name)
                        .set(update)
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .then(query => {
                            Logger.info('Character update done', { char: req.params.id })
                            res.send({ err: false, data: Object.assign(char, update) })
                            next();
                        })
                        .catch(err => {
                            Logger.error('Character update query error', err);
                            next(new Errs.InternalError('Character update query error'));
                        })
            })
            .catch(err => {
                Logger.error('Character update - Search failed', err);
                next(new Errs.InternalError());
            })
    }

    Delete = (req, res, next) => {
        Logger.info("Character deletion", req.params.id);

        Typeorm.getConnection()
            .createQueryBuilder()
            .delete()
            .from(CharacterEntity.name)
            .where('id = :id', { id : req.params.id })
            .execute()
            .then((deleted) => {
                if (deleted.affected == 0)
                    return next(new Errs.NotFoundError('This character encounter wasn\'t found'));

                res.send({
                    err: false,
                    data: true
                })
                Logger.info('Character deleted');
                next();
            })
            .catch(err => {
                Logger.error('Character deletion failed', { id: req.params.id })
                next(new Errs.InternalError('Character deletion failed'))
            });
    }

    ForceRefresh = (req, res, next) => {
        Jobs.Character.Update(req.params.id, (err, data) => {
            if (err)
                return next(new Errs.InternalServerError(err));
            res.send({ data: data });
            next();
        });
    }

    ForceRefreshMythic = (req, res, next) => {
        Jobs.Weekly.Update(req.params.id, (err, data) => {
            if (err)
                return next(new Errs.InternalServerError(err));
            res.send({ data: data });
            next();
        });
    }
}

module.exports = CharacterController;