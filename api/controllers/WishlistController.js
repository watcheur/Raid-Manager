const TypeORM = require('typeorm');
const Errs = require('restify-errors');
const Logger = require('../utils/Logger');
const DefaultController = require('./DefaultController');

const Entities = require('../entity/Entities');
const Jobs = require('../jobs/Jobs');

class WishlistController extends DefaultController  {
    
}

module.exports = WishlistController;