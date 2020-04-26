const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const Socket = require('../utils/Socket');

class NoteController extends DefaultController  {
    Create = (req, res, next) => {
        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'title', 'text', 'favorite' ])
        }
        catch (err) {
            Logger.error('Props err', err);
            return next(err);
        }

        TypeORM.getRepository(Entities.Note).save(props)
            .then(note => {
                res.send({
                    err: false,
                    data: note
                })

                Socket.Emit(Socket.Channels.Note, {
                    action: Socket.Action.Note.Create,
                    data: {
                        note: note
                    }
                });

                next()
            })
            .catch(err => {
                Logger.error('Error retrieving favorites notes', err);
                next(new Errs.InternalError('Database error'));
            })
    }

    Update = (req, res, next) => {
        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'title', 'text', 'favorite' ])
        }
        catch (err) {
            Logger.error('Props err', err);
            return next(err);
        }

        const repo = TypeORM.getRepository(Entities.Note);

        repo.findOne({ where: { id: req.params.id }})
            .then(note => {
                if (!note)
                    return next(new Errs.NotFoundError('Note not found'));

                    repo
                        .createQueryBuilder()
                        .update(Entities.Note)
                        .set(props)
                        .where("id = :id", { id: req.params.id })
                        .execute()
                        .then(query => {
                            Logger.info('Note update done', { note: req.params.id })
                            res.send({ err: false, data: Object.assign(note, props) })

                            Socket.Emit(Socket.Channels.Note, {
                                action: Socket.Action.Note.Update,
                                data: {
                                    note: note
                                }
                            });


                            next();
                        })
                        .catch(err => {
                            Logger.error('Error retrieving note', err);
                            next(new Errs.InternalError('Database error'));
                        })
            })
            .catch(err => {
                Logger.error('Error retrieving note', err);
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

    Delete = (req, res, next) => {
        TypeORM.getConnection()
            .createQueryBuilder()
            .delete()
            .from(Entities.Note)
            .where('id = :id', { id : req.params.id })
            .execute()
            .then((deleted) => {
                if (deleted.affected == 0)
                    return next(new Errs.NotFoundError('Note not found'));

                res.send({
                    err: false,
                    data: true
                })

                Socket.Emit(Socket.Channels.Note, {
                    action: Socket.Action.Note.Delete,
                    data: {
                        note: req.params.id
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
}

module.exports = NoteController;