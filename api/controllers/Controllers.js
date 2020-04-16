const cController = require('./CharacterController');
const wController = require('./WeeklyController');
const eController = require('./EncounterController');
const rController = require('./RaidController');
const pController = require('./PeriodController');
const exController = require('./ExpansionController');

module.exports = {
    Expansion: new exController(),
    Character: new cController(),

    Period: new pController(),
    Weekly: new wController(),

    Encounter: new eController(),
    Raid: new rController()
}