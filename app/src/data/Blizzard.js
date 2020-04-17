const CharacterType = {
    MAIN:   0,
    ALT:    1,
    ALT_FUN: 2
};

const CharacterRole = {
    DPS: 0,
    TANK: 1,
    HEAL: 2
};

const Classes = {
    Warrior: {
        ClassID: 1,
        Arms: 71,
        Fury: 72,
        Protection: 73
    },
    Paladin: {
        ClassID: 2,
        Holy: 65,
        Protection: 66,
        Retribution: 70
    },
    Hunter: {
        ClassID: 3,
        BeastMastery: 253,
        Marksmanship: 254,
        Survival: 255
    },
    Rogue: {
        ClassID: 4,
        Assassination: 259,
        Outlaw: 260,
        Subtlety: 261
    },
    Priest: {
        ClassID: 5,
        Discipline: 256,
        Holy: 257,
        Shadow: 258
    },
    DeathKnight: {
        ClassID: 6,
        Blood: 250,
        Frost: 251,
        Unholy: 252
    },
    Shaman: {
        ClassID: 7,
        Elemental: 262,
        Enhancement: 263,
        Restoration: 264
    },
    Mage: {
        ClassID: 8,
        Arcane: 62,
        Fire: 63,
        Frost: 64
    },
    Warlock: {
        ClassID: 9,
        Affliction: 265,
        Demonology: 266,
        Destruction: 267
    },
    Monk: {
        ClassID: 10,
        Brewmaster: 268,
        Windwalker: 269,
        Mistweaver: 270
    },
    Druid: {
        ClassID: 11,
        Balance: 102,
        Feral: 103,
        Guardian: 104,
        Restoration: 105
    },
    DemonHunter: {
        ClassID: 12,
        Havoc: 577,
        Vengeance: 581
    },
};

const Specs = {
    DPS: [
        Classes.DeathKnight.Frost,
        Classes.DeathKnight.Unholy,
        
        Classes.DemonHunter.Havoc,
        
        Classes.Druid.Balance,
        Classes.Druid.Feral,
        
        Classes.Hunter.BeastMastery,
        Classes.Hunter.Marksmanship,
        Classes.Hunter.Survival,

        Classes.Mage.Arcane,
        Classes.Mage.Frost,
        Classes.Mage.Fire,

        Classes.Monk.Windwalker,

        Classes.Paladin.Retribution,

        Classes.Priest.Shadow,

        Classes.Rogue.Assassination,
        Classes.Rogue.Outlaw,
        Classes.Rogue.Subtlety,

        Classes.Shaman.Elemental,
        Classes.Shaman.Enhancement,

        Classes.Warlock.Affliction,
        Classes.Warlock.Demonology,
        Classes.Warlock.Destruction,

        Classes.Warrior.Arms,
        Classes.Warrior.Fury
    ],
    HEAL: [
        Classes.Druid.Restoration,
        Classes.Monk.Mistweaver,
        Classes.Paladin.Holy,
        Classes.Shaman.Restoration,
        Classes.Priest.Discipline,
        Classes.Priest.Holy
    ],
    TANK: [
        Classes.DeathKnight.Blood,
        Classes.DemonHunter.Vengeance,
        Classes.Druid.Guardian,
        Classes.Warrior.Protection,
        Classes.Paladin.Protection
    ]
}

const Races = {
    Human: 1,
    Orc: 2,
    Dwarf: 3,
    NightElf: 4,
    Undead: 5,
    Tauren: 6,
    Gnome: 7,
    Troll: 8,
    Goblin: 9,
    BloodElf: 10,
    Draenei: 11,
    Worgen: 22,
    PandarenN: 24,
    PandarenA: 25,
    PandarenH: 26,
    Nightborne: 27,
    HighmountainTauren: 28,
    VoidElf: 29,
    LightforgedDraenei: 30,
    ZandalariTroll: 31,
    KulTiran: 32,
    DarkIronDwarf: 34,
    Vulpera: 35,
    MagharOrc: 36,
    Mechagnome: 37
}

const Genders = {
    Male: 0,
    Female: 1,
    Unknown: 2
}

const Factions = {
    Horde: 0,
    Alliance: 1,
    Neutral: 2
}

export default {
    Characters: {
        Type: CharacterType,
        Role: CharacterRole,
        Classes: Classes,
        Specs: Specs,
        Race: Races,
        Gender: Genders,
        Faction: Factions
    }
}