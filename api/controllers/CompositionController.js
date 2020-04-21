const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const Utils = require('../utils/Utils');
const Socket = require('../utils/Socket');

class CompositionController extends DefaultController  {
    Create = (req, res, next) => {
        Logger.info('Start composition create', req.body);

        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'event', 'encounter', 'characters' ]);
        }
        catch (err) {
            return next(err);
        }

        const repo = TypeORM.getRepository(Entities.Composition);

        TypeORM.getRepository(Entities.Event).findOne({ where: { id: props.event } })
            .then(ev => {
                if (ev == null)
                    return next(new Errs.NotFoundError('Event not found'));
                
                TypeORM.getRepository(Entities.Encounter).findOne({ where: { id: props.encounter }})
                    .then(async ec => {
                        if (ec == null)
                            return next(new Errs.NotFoundError('Encounter not found'));

                        if (props.note) {
                            let note = await TypeORM.getRepository(Entities.Note).save(props.note)
                            if (note != null)
                                props.note = note;
                        }

                        let comp = await repo.findOne({ where: { event: props.event, encounter: props.encounter } });

                        // Update
                        if (comp) {
                            let update = { event: props.event, encounter: props.encounter, note: (props.note ? props.note.id : null), updated: new Date() };
                            await repo.createQueryBuilder().update(Entities.Composition).set(update).where('id = :id', { id : res.id }).execute();
                            Object.assign(comp, update);
                        }
                        else
                            comp = await repo.save({ event: props.event, encounter: props.encounter, note: (props.note ? props.note.id : null), created: new Date() })

                        if (props.characters) {
                            await TypeORM.getConnection().createQueryBuilder().delete().from(Entities.CharacterComp).where('composition = :composition', { composition: comp.id }).execute();
                            props.characters.map(c => c.composition = comp.id);
                            await TypeORM.getRepository(Entities.CharacterComp).save(props.characters);
                        }

                        let dataRet = await repo.findOne({ relations: [ 'encounter', 'characters', 'characters.character', 'note' ], where: { id: comp.id }});
                        dataRet.characters = Utils.TransformsCharCompToChar(dataRet.characters);

                        res.send({
                            err: false,
                            data: dataRet
                        });

                        Socket.Emit(Socket.Channels.Composition, {
                            action: (comp ? Socket.Action.Composition.Create : Socket.Action.Composition.Update),
                            data: {
                                event: props.event,
                                encounter: props.encounter
                            }
                        });

                        next();
                    })
                    .catch(err => {
                        Logger.error('Encounter retrieve error', err);
                        next(new Errs.InternalError('Database error'));
                    });
            })
            .catch(err => {
                Logger.error('Event retrieve error', err);
                next(new Errs.InternalError('Database error'));
            });

        repo.findAndCount({ where: { event: props.event, boss: props.boss }})
    }

    Get = (req, res, next) => {
        Logger.info('Start retrieving compositions for given event', req.params);

        let where = {
            event: req.params.event
        };
        if (req.params.encounter)
            where.encounter = req.params.encounter;

        TypeORM.getRepository(Entities.Composition)
            .find({
                relations: [ 'encounter', 'characters', 'characters.character', 'note' ],
                where: where
            })
            .then(comps => {
                comps.map(c => c.characters = Utils.TransformsCharCompToChar(c.characters));

                res.send({
                    err: false,
                    data: comps
                })
            })
            .catch(err => {
                Logger.error('Error retrieving compositions expansion', err);
                next(new Errs.InternalError('Database error'));
            })
    }
}

module.exports = CompositionController;