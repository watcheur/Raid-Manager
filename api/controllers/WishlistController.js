const TypeORM = require('typeorm');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

const Entities = require('../entity/Entities');
const Jobs = require('../jobs/Jobs');

class WishlistController extends DefaultController  {
    Toggle = (req, res, next) => {
        Logger.info('Start item toggle', req.body);

        let need = {};
        try {
            need = this.RequiredProps(req.body, [ 'character', 'item', 'difficulty' ]);
        } catch (err) {
            return next(err);
        }

        let repo = TypeORM.getRepository(Entities.CharacterNeed);

        repo
            .findOne({
                where: need
            })
            .then(el => {
                if (el) {
                    TypeORM.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(Entities.CharacterNeed)
                        .where('item = :item', need)
                        .andWhere('character = :character', need)
                        .andWhere('difficulty = :difficulty', need)
                        .execute()
                        .then((deleted) => {
                            if (deleted.affected == 0)
                                return next(new Errs.NotFoundError("This need wasn't found. Really ???"));

                            res.send({
                                err: false,
                                data: true
                            })

                            Logger.info('Character need deleted');
                            next();
                        })
                        .catch(err => {
                            Logger.error('Character need deletion failed', err)
                            next(new Errs.InternalError('Character need deletion failed'))
                        });
                }
                else
                {
                    repo.save(need)
                        .then((saved) => {
                            res.send({
                                err: false,
                                data: saved
                            })

                            Logger.info('Character need created');
                            next();
                        })
                        .catch(err => {
                            Logger.error('Character need insertion failed', err)
                            next(new Errs.InternalError('Character need insertion'))
                        });
                }
            })
            .catch(err => {
                Logger.error('Character need fetch failed', err);
                next(new Errs.InternalError());
            })
    }

    GetAll = (req, res, next) => {
        Logger.info('Character need search', req.params);
        const reqs = this.ClearProps(req.query, [ 'character', 'item', 'difficulty', 'encounter', 'raid' ]);
        Logger.info('Characters need search found params: ', reqs);

        let query = TypeORM.getRepository(Entities.CharacterNeed).createQueryBuilder("need")
            .leftJoinAndSelect("need.item", "item")
            .leftJoinAndSelect("item.source", "encounter")
            .leftJoinAndSelect("need.character", "character");

        if (reqs.character)
            query = query.where('character.id = :character', reqs);
        if (reqs.difficulty)
            query = query.andWhere('difficulty = :difficulty', reqs);
        if (reqs.item)
            query = query.andWhere('item.id = :item', reqs);
        if (reqs.encounter)
            query = query.andWhere('item.source = :encounter', reqs);
        if (reqs.raid)
            query = query.andWhere('encounter.raid = :raid', reqs);

        query
            .getMany()
                .then(values => {
                    res.send({ err: false, data: values.map(v => {
                        return {
                            item: {
                                id: v.item.id,
                                name: v.item.name,
                                quality: v.item.quality,
                                media: v.item.media
                            },
                            difficulty: v.difficulty,
                            character: {
                                id: v.character.id,
                                name: v.character.name,
                                class: v.character.class
                            }
                        }
                    }) });
                    next();
                })
                .catch(err => {
                    Logger.error('Wishlist fetch failed', err);
                    next(new Errs.InternalError('Wishlist fetch failed'));
                })
    }
}

module.exports = WishlistController;