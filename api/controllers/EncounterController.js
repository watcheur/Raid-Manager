const blizzard = require('blizzard.js').initialize(require('../config.json').blizzard);

const TypeORM = require('typeorm');
const Entities = require('../entity/Entities');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');
const EncounterJobs = require('../jobs/Jobs');
const { resolve } = require('q');
const Jobs = require('../jobs/Jobs');

class EncounterController extends DefaultController  {
    
}

module.exports = EncounterController;