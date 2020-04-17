const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class CompositionController extends DefaultController  {
    Replace() {

    }

    Create = (req, res, next) => {
        Logger.info('Start composition create', req.body);

        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'event', 'encounter', 'characters', 'note' ])
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
                            let update = { event: props.event, encounter: props.encounter, note: (props.note.id || null), updated: new Date() };
                            await repo.createQueryBuilder().update(Entities.Composition).set(update).where('id = :id', { id : res.id }).execute();
                            Object.assign(res, update);
                        }
                        else
                            comp = repo.save({ event: props.event, encounter: props.encounter, note: (props.note.id || null), created: new Date() })

                        if (props.characters) {
                            await TypeORM.getConnection().createQueryBuilder().delete().from(Entities.CharacterComp).where('composition = :composition', { composition: comp.id }).execute();
                            props.characters.map(c => c.composition = comp.id);
                            console.log(props.characters);
                            await TypeORM.getRepository(Entities.CharacterComp).save(props.characters);
                        }

                        let dataRet = await repo.findOne({ relations: [ 'encounter', 'characters', 'characters.character', 'note' ], where: { id: comp.id }});
                        dataRet.characters = dataRet.characters.map(c => {
                            return {
                                id: c.character.id,
                                name: c.character.name,
                                realm: c.character.realm,
                                class: c.character.class,
                                spec: c.character.spec,
                                role: c.role
                            }
                        });

                        res.send({
                            err: false,
                            data: dataRet
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
}

module.exports = CompositionController;