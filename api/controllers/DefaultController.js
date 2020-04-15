const Errs = require('restify-errors');

class DefaultController {
    RequiredProps = (obj, props) => {
        props.forEach((p) => {
            if (!obj.hasOwnProperty(p)) {
                throw new Errs.BadRequestError('Missing `'+ p +'` property');
            }
        });
    }

    ClearProps = (obj, props) => {
        let ret = {};

        props.forEach((prop) => {
            if (obj.hasOwnProperty(prop) && obj[prop].length)
                ret[prop] = obj[prop];
        })

        return ret;
    }

    Get = (req, res, next) => {
        next(new Errs.NotImplementedError());
    }

    Create = (req, res, next) => {
        next(new Errs.NotImplementedError());
    }

    Update = (req, res, next) => {
        next(new Errs.NotImplementedError());
    }

    Delete = (req, res, next) => {
        next(new Errs.NotImplementedError());
    }
}

module.exports = DefaultController;