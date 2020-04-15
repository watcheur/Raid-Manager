const Character = require('./Character');
const Weekly = require('./Weekly');
const Raid = require('./Raid');
const Boss = require('./Boss');
const Period = require('./Period');
const TypeORM = require('typeorm');

const CharacterSchema   = new TypeORM.EntitySchema(require('./Character'));
const WeeklySchema      = new TypeORM.EntitySchema(require('./Weekly'));
const RaidSchema        = new TypeORM.EntitySchema(require('./Raid'));
const BossSchema        = new TypeORM.EntitySchema(require('./Boss'));
const PeriodSchema      = new TypeORM.EntitySchema(require('./Period'));

module.exports = {
    All : [
        CharacterSchema,
        WeeklySchema,
        RaidSchema,
        BossSchema,
        PeriodSchema
    ],
    Character: CharacterSchema,
    Weekly: WeeklySchema,
    Raid: RaidSchema,
    Boss: BossSchema,
    Period: PeriodSchema
}