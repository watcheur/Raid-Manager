const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class OptionController extends DefaultController  {

    batchInstall = async (data, cb) => {
        const repo = TypeORM.getRepository(Entities.Option);

        let exist = await repo.findOne({ key: data.key });

        if (exist) {
            repo.createQueryBuilder()
                .update(Entities.Option)
                .set(data)
                .where("key = :key", { key: data.key })
                .execute()
                .then(opt => { cb(Object.assign(exist, data)) })
                .catch(err => {
                    next(new Errs.InternalError('Database error'));
                })
        }
        else {
            repo.save(data)
                .then(opt => { cb(opt) })
                .catch(err => {
                    next(new Errs.InternalError('Database error'));
                })
        }
    }

    Create = (req, res, next) => {
        let props = {};
        try {
            props = this.RequiredProps(req.body, [ 'options' ])
        }
        catch (err) {
            Logger.error('Error saving option', err);
            next(new Errs.InternalError('Database error'));
        }

        let promises = [];
        props.options.forEach(opt => {
            promises.push(new Promise((resolve, reject) => this.batchInstall(opt, resolve)));
        });

        Promise.all(promises).then(values => {
            res.send({ err: false, data: values });
        })
    }
    
    Get = (req, res, next) => {
        Logger.info('Retrieve options');
        TypeORM.getRepository(Entities.Option).find()
            .then(opts => {
                res.send({
                    err: false,
                    data: opts
                });
                next();
            })
            .catch(err => {
                Logger.error('Error retrieving options', err);
                next(new Errs.InternalError('Database error'));
            })
    }
}

module.exports = OptionController;