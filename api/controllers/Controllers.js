const cController = require('./CharacterController');
const wController = require('./WeeklyController');
const bController = require('./BossController');
const rController = require('./RaidController');

module.exports = {
    Character: new cController(),
    Weekly: new wController(),
    Boss: new bController(),
    Raid: new rController()
}