enum CharacterType {
    MAIN,
    ALT,
    ALTFUN
}

enum Role {
    DPS,
    HEAL,
    TANK
}

enum Race {
    Human = 1,
    Orc,
    Dwarf,
    NightElf,
    Undead,
    Tauren,
    Gnome,
    Troll,
    Goblin,
    BloodElf,
    Draenei,
    Worgen = 22,
    PandarenN = 24,
    PandarenA,
    PandarenH,
    Nightborne,
    HightmountainTauren,
    VoidElf,
    LightforgedDraenei,
    ZandalariTroll,
    DarkIronDwarf = 34,
    Vulpera,
    MagharOrc,
    Mechagnome
}

enum Gender {
    Male = "MALE",
    Female = "FEMALE",
    Unknown = "UNKNOWN"
}

enum Faction {
    Horde = "HORDE",
    Alliance = "ALLIANCE",
    Neutral = "NEUTRAL"
}

enum CharacterClass {
    Warrior = 1,
    Paladin,
    Hunter,
    Rogue,
    Priest,
    DeathKnight,
    Shaman,
    Mage,
    Warlock,
    Monk,
    Druid,
    DemonHunter
}

enum CharacterSpec {
    Warrior_Arms = 71,
    Warrior_Fury = 72,
    Warrior_Protection = 73,

    Paladin_Holy = 65,
    Paladin_Protection = 66,
    Paladin_Retribution = 70,

    Hunter_BeastMastery = 253,
    Hunter_Marksmanship = 254,
    Hunter_Survival = 255,

    Rogue_Assassination = 259,
    Rogue_Outlaw = 260,
    Rogue_Subtlety = 261,

    Priest_Discipline = 256,
    Priest_Holy = 257,
    Priest_Shadow = 258,

    DeathKnight_Blood = 250,
    DeathKnight_Frost = 251,
    DeathKnight_Unholy = 252,

    Shaman_Elemental = 262,
    Shaman_Enhancement = 263,
    Shaman_Restoration = 264,

    Mage_Arcane = 62,
    Mage_Fire = 63,
    Mage_Frost = 64,

    Warlock_Afflication = 265,
    Warlock_Demonology = 266,
    Warlock_Destruction = 267,

    Monk_Brewmaster = 268,
    Monk_Windwalker = 269,
    Monk_Mistweaver = 270,

    Druid_Balance = 102,
    Druid_Feral = 103,
    Druid_Guardian = 104,
    Druid_Restoration = 105,

    DemonHunter_Havoc = 577,
    DemonHunter_Vengeance = 581
}

export const Dps: CharacterSpec[] = [
    CharacterSpec.DeathKnight_Frost,
    CharacterSpec.DeathKnight_Unholy,

    CharacterSpec.DemonHunter_Havoc,

    CharacterSpec.Druid_Balance,
    CharacterSpec.Druid_Feral,

    CharacterSpec.Hunter_BeastMastery,
    CharacterSpec.Hunter_Marksmanship,
    CharacterSpec.Hunter_Survival,

    CharacterSpec.Mage_Arcane,
    CharacterSpec.Mage_Frost,
    CharacterSpec.Mage_Fire,

    CharacterSpec.Monk_Windwalker,

    CharacterSpec.Paladin_Retribution,

    CharacterSpec.Priest_Shadow,

    CharacterSpec.Rogue_Assassination,
    CharacterSpec.Rogue_Outlaw,
    CharacterSpec.Rogue_Subtlety,

    CharacterSpec.Shaman_Elemental,
    CharacterSpec.Shaman_Enhancement,

    CharacterSpec.Warlock_Afflication,
    CharacterSpec.Warlock_Demonology,
    CharacterSpec.Warlock_Destruction,

    CharacterSpec.Warrior_Arms,
    CharacterSpec.Warrior_Fury
]

export const Heal: CharacterSpec[] = [
    CharacterSpec.Druid_Restoration,
    CharacterSpec.Monk_Mistweaver,
    CharacterSpec.Priest_Holy,
    CharacterSpec.Druid_Restoration,
    CharacterSpec.Priest_Discipline,
    CharacterSpec.Paladin_Holy
]

export const Tank: CharacterSpec[] = [
    CharacterSpec.DeathKnight_Blood,
    CharacterSpec.DemonHunter_Vengeance,
    CharacterSpec.Druid_Guardian,
    CharacterSpec.Paladin_Protection,
    CharacterSpec.Warrior_Protection,
    CharacterSpec.Monk_Brewmaster
]

enum CharacterItemSlot {
    HEAD = 'HEAD',
    NECK = 'NECK',
    SHOULDER = 'SHOULDER',
    CHEST = 'CHEST',
    WAIST = 'WAIST',
    LEGS = 'LEGS',
    FEET = 'FEET',
    WRIST = 'WRIST',
    HANDS = 'HANDS',
    FINGER_1 = 'FINGER_1',
    FINGER_2 = 'FINGER_2',
    TRINKET_1 = 'TRINKET_1',
    TRINKET_2 = 'TRINKET_2',
    BACK = 'BACK',
    MAIN_HAND = 'MAIN_HAND',
    OFF_HAND = 'OFF_HAND'
}

export const intellClasses: CharacterClass[] = [
    CharacterClass.Priest,
    CharacterClass.Mage,
    CharacterClass.Warlock
];

export const intellSpecs: CharacterSpec[] = [
    CharacterSpec.Druid_Balance,
    CharacterSpec.Druid_Restoration,
    CharacterSpec.Shaman_Elemental,
    CharacterSpec.Monk_Mistweaver,
    CharacterSpec.Paladin_Holy
];

export const agiClasses: CharacterClass[] = [
    CharacterClass.Hunter,
    CharacterClass.DemonHunter,
    CharacterClass.Monk,
    CharacterClass.Rogue
]

export const agiSpecs: CharacterSpec[] = [
    CharacterSpec.Druid_Feral,
    CharacterSpec.Druid_Guardian,
    CharacterSpec.Shaman_Enhancement
]

export const strClasses: CharacterClass[] = [
    CharacterClass.Warrior,
    CharacterClass.DeathKnight,
    CharacterClass.Paladin
]

export { CharacterType, Role, Race, Gender, Faction, CharacterClass, CharacterSpec, CharacterItemSlot }