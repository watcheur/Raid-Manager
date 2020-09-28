const Queue = require('bull');
const config = require('../config.json').redis;

module.exports = {
    Character: new Queue('character', { redis: config }).on('completed', (job, res) => job.remove()),
    Weekly: new Queue('weekly', { redis: config }).on('completed', (job, res) => job.remove()),
    Item: new Queue('item', { redis: config }).on('completed', (job, res) => job.remove()),
    Media: new Queue('media', { redis: config }).on('completed', (job, res) => job.remove()),
    Encounter: new Queue('encounter', { redis: config }).on('completed', (job, res) => job.remove())
}