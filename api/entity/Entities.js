const TypeORM = require('typeorm');

const CharacterSchema   = new TypeORM.EntitySchema(require('./Character'));
const WeeklySchema      = new TypeORM.EntitySchema(require('./Weekly'));
const RaidSchema        = new TypeORM.EntitySchema(require('./Raid'));
const EncounterSchema   = new TypeORM.EntitySchema(require('./Encounter'));
const PeriodSchema      = new TypeORM.EntitySchema(require('./Period'));
const ExpansionSchema   = new TypeORM.EntitySchema(require('./Expansion'));

module.exports = {
    All : [
        CharacterSchema,

        ExpansionSchema,

        WeeklySchema,
        PeriodSchema,

        RaidSchema,
        EncounterSchema,
    ],
    Expansion: ExpansionSchema,
    Character: CharacterSchema,
    // Mythic +
    Period: PeriodSchema,
    Weekly: WeeklySchema,
    // Raids
    Raid: RaidSchema,
    Encounter: EncounterSchema,
}