const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class NoteController extends DefaultController  {
    Create = (req, res, next) => {
        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'text', 'favorite' ])
        }
        catch (err) {
            Logger.error('Error retrieving favorites notes', err);
            next(new Errs.InternalError('Database error'));
        }

        TypeORM.getRepository(Entities.Note).save({ props })
            .then(note => {
                res.send({
                    err: false,
                    data: note
                })
                next()
            })
            .catch(err => {
                Logger.error('Error retrieving favorites notes', err);
                next(new Errs.InternalError('Database error'));
            })
    }
    
    Favorites = (req, res, next) => {
        Logger.info('Retrieve favorites notes');
        TypeORM.getRepository(Entities.Note).find({ where: { favorite: true }})
            .then(notes => {
                res.send({
                    err: false,
                    data: notes
                });
                next();
            })
            .catch(err => {
                Logger.error('Error retrieving favorites notes', err);
                next(new Errs.InternalError('Database error'));
            })
    }
}

module.exports = NoteController;