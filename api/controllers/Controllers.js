const cController   = require('./CharacterController');
const wController   = require('./WeeklyController');
const eController   = require('./EncounterController');
const rController   = require('./RaidController');
const pController   = require('./PeriodController');
const exController  = require('./ExpansionController');
const evController  = require('./EventController');
const coController  = require('./CompositionController');
const nController   = require('./NoteController');
const oController   = require('./OptionController');
const bController   = require('./BlizzardController');
const sController   = require('./StatController');

module.exports = {
    Expansion: new exController(),
    Character: new cController(),

    Period: new pController(),
    Weekly: new wController(),

    Encounter: new eController(),
    Raid: new rController(),

    Event: new evController(),
    Composition: new coController(),
    Note: new nController(),

    Option: new oController(),
    Blizzard: new bController(),

    Stat: new sController()
}