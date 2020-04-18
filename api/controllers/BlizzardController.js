const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

class BlizzardController extends DefaultController  {

}

module.exports = BlizzardController;