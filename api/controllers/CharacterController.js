const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

const TypeORM = require('typeorm');
const Errs = require('restify-errors');
const Jobs = require('../jobs/Jobs');
const Queues = require('../utils/Queues');
const Logger = require('../utils/Logger');
const Enums = require('../utils/Enums');
const Utils = require('../utils/Utils');
const DefaultController = require('./DefaultController');
const Entities = require('../entity/Entities');
const Context = require('../utils/Context');
const Socket = require('../utils/Socket');

class CharacterController extends DefaultController {
    GetAll = (req, res, next) => {
        Logger.info('Characters search', req.params);
        const reqs = this.ClearProps(req.query, [ 'name', 'realm', 'level', 'type', 'class', 'spec', 'role', 'equipped', 'avg', 'azerite', 'weekly', 'refresh', 'refreshWeekly' ]);
        Logger.info('Characters search found params: ', reqs);

        if (reqs['name'])
            reqs['name'] = TypeORM.Like(`%${reqs['name']}%`)
        if (reqs['realm'])
            reqs['realm'] = TypeORM.Like(`%${reqs['realm']}%`)
        if (reqs['role'])
            reqs['spec'] = TypeORM.In(Utils.GetSpecsByRole(reqs['role']));
        if (reqs['equipped'])
            reqs['equipped'] = TypeORM.MoreThanOrEqual(reqs['equipped']);
        if (reqs['avg'])
            reqs['avg'] = TypeORM.MoreThanOrEqual(reqs['avg']);
        if (reqs['azerite'])
            reqs['azerite'] = TypeORM.MoreThanOrEqual(reqs['azerite']);

        if (req.weekly)
            req.weekly = Context.CurrentPeriod.Id;

        TypeORM.getRepository(Entities.Character)
            .find({
                select: [
                    "id", "name", "realm", "type", "level", "race", "gender", "faction", "class", "spec", "azerite", "avg", "equipped"
                ],
                relations: ["dungeons", "items", "items.item", "player"],
                where: reqs,
                order: {
                    type: 'ASC',
                    name: 'ASC'
                }
            })
            .then(chars => {
                chars = chars.map(c => {
                    if (reqs.refresh)
                        Queues.Character.add({ character: c.id });
                    
                    if (reqs.refreshWeekly)
                        Queues.Weekly.add({ character: c.id });

                    c = Utils.CharToCharRet(c, reqs['weekly'] || Context.CurrentPeriod.id)
                    /*
                    c.role = Utils.GetRoleBySpec(c.spec);
                    //c.dungeons = c.dungeons.filter(d => d.period >= Context.CurrentPeriod.id - 3);
                    c.weekly = Math.max.apply(Math, c.dungeons.map(d => d.level));
                    */
                    delete c.dungeons;

                    return c;
                });

                if (reqs['weekly'] >= 0)
                    res.send({ err: false, data: chars.filter(c => c.weekly)});
                else
                    res.send({err: false, data: chars });

                next();
            })
            .catch(err => {
                Logger.error('Character retrieve failed', err);
                next(new Errs.InternalError('Character retrieve failed'));
            })
    }

    Get = (req, res, next) => {
        Logger.info('Retrieve character', req.params);

        TypeORM.getRepository(Entities.Character)
            .findOne({
                select: [
                    "id", "name", "realm", "type", "level", "race", "gender", "faction", "class", "spec", "azerite", "avg", "equipped"
                ],
                relations: ["dungeons", "items", "items.item"],
                where: {
                    id: req.params.id
                }
            })
            .then(c => {
                if (c == null) {
                    Logger.info('Character not found');
                    return next(new Errs.NotFoundError('Character not found'));
                }

                c = Utils.CharToCharRet(c, Context.CurrentPeriod.id)
                c.dungeons = c.dungeons.filter(d => d.period >= Context.CurrentPeriod.id - 3);

                res.send({
                    err: false,
                    data: c
                })
            })
            .catch(err => {
                console.log(err);
                Logger.error('Character retrieve failed', { id: req.params.id });
                next(new Errs.InternalError('Character retrieve failed'));
            })
    }

    Create = async (req, res, next) => {
        Logger.info('Start character create', req.body);

        let char = {};
        try {
            char = this.RequiredProps(req.body, [ 'player', 'name', 'realm', 'type' ]);
        } catch (err) {
            return next(err);
        }

        if (char.player > 0) {
            const player = await TypeORM.getRepository(Entities.Player).findOne({ where: { id: char.player } });
            if (!player)
                return next(new Errs.NotFoundError('Player not found'));
            else
                char.player = player;
        }

        char.created = new Date();

        const repo = TypeORM.getRepository(Entities.Character);
        repo
            .createQueryBuilder("c")
            .where("BINARY c.name = :name AND c.realm = :realm", { name: char.name, realm: char.realm })
            .getCount()
            .then(async (nb) => {
                if (nb > 0)
                    return next(new Errs.BadRequestError('Character already registered'));

                try {
                    const tokenRes = await blizzard.getApplicationToken();
                    blizzard.defaults.token = tokenRes.data.access_token;

                    const resChar = await blizzard.wow.character('index', { origin: 'eu', realm: char.realm.toLowerCase(), name: char.name.toLowerCase(), params: {
                        access_token: blizzard.defaults.token,
                        locale: 'en_GB',
                        namespace: 'profile-EU'
                    }});
                    
                    if (resChar) {
                        switch (resChar.data.gender.type) {
                            case "MALE": char.gender = Enums.Characters.Gender.Male; break;
                            case "FEMALE": char.gender = Enums.Characters.Gender.Female; break;
                            default: char.gender = Enums.Characters.Gender.Unknown; break;
                        }

                        switch (resChar.data.faction.type) {
                            case "HORDE": char.faction = Enums.Characters.Faction.Horde; break;
                            case "ALLIANCE": char.faction = Enums.Characters.Faction.Alliance; break;
                            default: char.faction = Enums.Characters.Faction.Unknown; break;
                        }

                        char.race = resChar.data.race.id;
                        char.class = resChar.data.character_class.id;
                        char.spec = resChar.data.active_spec.id;
                        char.level = resChar.data.level;
                        char.avg = resChar.data.average_item_level;
                        char.equipped = resChar.data.equipped_item_level;
                    }
                }
                catch (err) {
                    Logger.error(err);
                    if (err.response && err.response.status == 404)
                        return next(new Errs.NotFoundError('This character doesn\'t exist'));
                    return next(new Errs.InternalError('Blizzard API error'));
                }

                repo.save(char)
                    .then(saved => {
                        res.send({
                            err: false,
                            data: saved
                        });

                        Queues.Character.add({ character: saved.id });
                        Queues.Weekly.add({ character: saved.id });

                        Socket.Emit(Socket.Channels.Character, {
                            action: Socket.Action.Character.Create,
                            data: {
                                character: saved
                            }
                        });

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
        const repo = TypeORM.getRepository(Entities.Character);
        const update = this.ClearProps(req.body, [ 'type' ]);

        Logger.info('Start character update', { id: req.params.id, update: update });

        update.updated = new Date();
        repo
            .createQueryBuilder("c")
            .where("c.id = :id", { id: req.params.id })
            .getOne()
            .then((char) => {
                if (char == null)
                    return next(new Errs.NotFoundError('Character not found'));

                repo
                    .createQueryBuilder()
                    .update(Entities.Character)
                    .set(update)
                    .where("id = :id", { id: req.params.id })
                    .execute()
                    .then(query => {
                        Logger.info('Character update done', { char: req.params.id })

                        Socket.Emit(Socket.Channels.Character, {
                            action: Socket.Action.Character.Update,
                            data: {
                                character: Object.assign(char, update)
                            }
                        });

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

        TypeORM.getConnection()
            .createQueryBuilder()
            .delete()
            .from(Entities.Character)
            .where('id = :id', { id : req.params.id })
            .execute()
            .then((deleted) => {
                if (deleted.affected == 0)
                    return next(new Errs.NotFoundError('This character encounter wasn\'t found'));

                res.send({
                    err: false,
                    data: true
                })

                Socket.Emit(Socket.Channels.Character, {
                    action: Socket.Action.Character.Delete,
                    data: {
                        character: req.params.id
                    }
                });

                Logger.info('Character deleted');
                next();
            })
            .catch(err => {
                Logger.error('Character deletion failed', err)
                next(new Errs.InternalError('Character deletion failed'))
            });
    }

    ForceRefresh = (req, res, next) => {
        Promise.all([
            new Promise(function (res, rej) { Jobs.Character.Update(req.params.id, res) }),
            new Promise(function (res, rej) { Jobs.Weekly.Update(req.params.id, res) })
        ])
        .then(values => {
            TypeORM.getRepository(Entities.Character).findOne({ relations: ['dungeons'], where: { id: req.params.id }})
                .then(char => {
                    char = Utils.CharToCharRet(char, Context.CurrentPeriod.id)
                    char.dungeons = char.dungeons.filter(d => d.period >= Context.CurrentPeriod.id - 3);
                    
                    res.send({ err: false, data: char })
                    next();
                })
                .catch(err => {
                    Logger.error(err);
                    next(new Errs.InternalError('Database error'));
                })
        })
        .catch(err => {
            Logger.error(err);
            next(new Errs.InternalError('Error'));
        })
    }
}

module.exports = CharacterController;