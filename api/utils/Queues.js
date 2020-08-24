const Queue = require('bull');
const config = require('../config.json').redis;

module.exports = {
    Character: new Queue('character', { redis: config }),
    Weekly: new Queue('weekly', { redis: config }),
    Item: new Queue('item', { redis: config }),
    Encounter: new Queue('encounter', { redis: config })
}