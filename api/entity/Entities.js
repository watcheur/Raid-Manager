const TypeORM = require('typeorm');
const CharacterItem = require('./CharacterItem');

const ExpansionSchema       = new TypeORM.EntitySchema(require('./Expansion'));

const PlayerSchema          = new TypeORM.EntitySchema(require('./Player'));
const CharacterSchema       = new TypeORM.EntitySchema(require('./Character'));
const CharacterItemSchema   = new TypeORM.EntitySchema(require('./CharacterItem'));
const CharacterNeedSchema   = new TypeORM.EntitySchema(require('./CharacterNeed'));

const WeeklySchema          = new TypeORM.EntitySchema(require('./Weekly'));
const PeriodSchema          = new TypeORM.EntitySchema(require('./Period'));

const RaidSchema            = new TypeORM.EntitySchema(require('./Raid'));
const EncounterSchema       = new TypeORM.EntitySchema(require('./Encounter'));
const ItemSchema            = new TypeORM.EntitySchema(require('./Item'));

const EventSchema           = new TypeORM.EntitySchema(require('./Event'));
const CompositionSchema     = new TypeORM.EntitySchema(require('./Composition'));
const CharacterCompSchema   = new TypeORM.EntitySchema(require('./CharacterComp'));
const NoteSchema            = new TypeORM.EntitySchema(require('./Note'));
const LogSchema             = new TypeORM.EntitySchema(require('./Log'));

const RealmSchema           = new TypeORM.EntitySchema(require('./Realm'));

const OptionSchema          = new TypeORM.EntitySchema(require('./Option'));

module.exports = {
    All : [
        ExpansionSchema,

        ItemSchema,
        RaidSchema,
        EncounterSchema,
        
        PlayerSchema,
        CharacterSchema,
        CharacterItemSchema,
        CharacterNeedSchema,

        WeeklySchema,
        PeriodSchema,

        EventSchema,
        CompositionSchema,
        CharacterCompSchema,
        NoteSchema,
        LogSchema,

        OptionSchema,
        RealmSchema
    ],
    Expansion: ExpansionSchema,
    Player: PlayerSchema,
    Character: CharacterSchema,
    CharacterItem: CharacterItemSchema,
    CharacterNeed: CharacterNeedSchema,
    // Mythic +
    Period: PeriodSchema,
    Weekly: WeeklySchema,
    // Raids
    Raid: RaidSchema,
    Encounter: EncounterSchema,
    Item: ItemSchema,
    // Events
    Event: EventSchema,
    Composition: CompositionSchema,
    CharacterComp: CharacterCompSchema,
    Note: NoteSchema,
    Log: LogSchema,
    // Misc
    Option: OptionSchema,
    Realm: RealmSchema
}