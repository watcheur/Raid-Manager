const Typeorm = require('typeorm');
const WeeklyEntity = require('../entity/Raid');
const RaidEntity = require('../entity/Raid');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

class BossController extends DefaultController  {
    Get = (req, res, next) => {
        Logger.info('Retrieve boss informations', req.params);
    }

    GetAll = (req, res, next) => {

    }
}

module.exports = BossController;