const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class CompositionController extends DefaultController  {
    Create = (req, res, next) => {
        Logger.info('Start composition create', req.body);

        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'event', 'encounter', 'characters' ])
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
                    .then(ec => {
                        if (ec == null)
                            return next(new Errs.NotFoundError('Encounter not found'));

                        TypeORM.createQueryBuilder().delete().from(Entities.Composition).where('event = :event AND encounter = :encounter', { id : req.params.id }).execute()
                            .then(() => {
                                
                            })
                            .catch(err => {
                                Logger.error('Composition clear error', err);
                                next(new Errs.InternalError('Database error'));
                            })
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