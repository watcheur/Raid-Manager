const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

/**
 * Unused.... yet ?
 */
class BossController extends DefaultController  {

}

module.exports = BossController;