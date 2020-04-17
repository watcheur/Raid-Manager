const CharacterType = {
    MAIN: 0,
    ALT: 1,
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
    },
    /**
     * @param {CharacterType} type
     */
    TypeToObj: (type) => {
        switch (type) {
            case CharacterType.MAIN:
                return { label: "Main", classes: [".main"] }
            case CharacterType.ALT:
                return { label: "Alt", classes: [".alt"] }
            case CharacterType.ALT_FUN:
                return { label: "Alt fun", classes: [".alt-fun"] }
        }
    },
    /**
     * @param {CharacterRole} role
     */
    RoleToObj: (role) => {
        switch (role) {
            case CharacterRole.DPS:
                return { label: "Dps", classes: [".damage"] }
            case CharacterRole.HEAL:
                return { label: "Heal", classes: [".healer"] }
            case CharacterRole.TANK:
                return { label: "Tank", classes: [".tank"] }
        }
    },
    /**
     * @param {Classes} cl
     */
    ClassToObj: (cl) => {
        switch (cl) {
            case Classes.Warrior:
                return { label: "Warrior", classes: ['.warrior'] }
            case Classes.Warlock:
                return { label: "Warlock", classes: ['.warlock'] }
            case Classes.Shaman:
                return { label: "Shaman", classes: ['.shaman'] }
            case Classes.Rogue:
                return { label: "Rogue", classes: ['.rogue'] }
            case Classes.Priest:
                return { label: "Priest", classes: ['.priest'] }
            case Classes.Paladin:
                return { label: "Paladin", classes: ['.paladin'] }
            case Classes.Monk:
                return { label: "Monk", classes: ['.monk'] }
            case Classes.Mage:
                return { label: "Mage", classes: ['.mage'] }
            case Classes.Hunter:
                return { label: "Hunter", classes: ['.hunter'] }
            case Classes.Druid:
                return { label: "Druid", classes: ['.druid'] }
            case Classes.DeathKnight:
                return { label: "DeathKnight", classes: ['.deathknight'] }
            case Classes.DemonHunter:
                return { label: "DemonHunter", classes: ['.demonhunter'] }
            default:
                return { label: "Unknown", classes: ['.unknown'] }
        }
    },
    /**
     * @param {Specs} spec
     */
    SpecToObj: (spec) => {
        switch (spec) {
            case Classes.DeathKnight.Frost:
                return { label: "Frost", classes: ['.deathknight', '.frost'] }
            case Classes.DeathKnight.Unholy:
                return { label: "Unholy", classes: ['.deathknight', '.unholy'] }
            case Classes.DemonHunter.Havoc:
                return { label: "Havoc", classes: ['.demonhunter', '.havoc'] }
            case Classes.Druid.Balance:
                return { label: "Balance", classes: ['.druid', '.balance'] }
            case Classes.Druid.Feral:
                return { label: "Feral", classes: ['.druid', '.feral'] }
            case Classes.Hunter.BeastMastery:
                return { label: "BeastMastery", classes: ['.hunter', '.beastMastery'] }
            case Classes.Hunter.Marksmanship:
                return { label: "Marksmanship", classes: ['.hunter', '.marksmanship'] }
            case Classes.Hunter.Survival:
                return { label: "Survival", classes: ['.hunter', '.survival'] }
            case Classes.Mage.Arcane:
                return { label: "Arcane", classes: ['.mage', '.arcane'] }
            case Classes.Mage.Frost:
                return { label: "Frost", classes: ['.mage', '.frost'] }
            case Classes.Mage.Fire:
                return { label: "Fire", classes: ['.mage', '.fire'] }
            case Classes.Monk.Windwalker:
                return { label: "Windwalker", classes: ['.monk', '.windwalker'] }
            case Classes.Paladin.Retribution:
                return { label: "Retribution", classes: ['.paladin', '.retribution'] }
            case Classes.Priest.Shadow:
                return { label: "Shadow", classes: ['.priest', '.shadow'] }
            case Classes.Rogue.Assassination:
                return { label: "Assassination", classes: ['.rogue', '.assassination'] }
            case Classes.Rogue.Outlaw:
                return { label: "Outlaw", classes: ['.rogue', '.outlaw'] }
            case Classes.Rogue.Subtlety:
                return { label: "Subtlety", classes: ['.rogue', '.subtlety'] }
            case Classes.Shaman.Elemental:
                return { label: "Elemental", classes: ['.shaman', '.elemental'] }
            case Classes.Shaman.Enhancement:
                return { label: "Enhancement", classes: ['.shaman', '.enhancement'] }
            case Classes.Warlock.Affliction:
                return { label: "Affliction", classes: ['.warlock', '.affliction'] }
            case Classes.Warlock.Demonology:
                return { label: "Demonology", classes: ['.warlock', '.demonology'] }
            case Classes.Warlock.Destruction:
                return { label: "Destruction", classes: ['.warlock', '.destruction'] }
            case Classes.Warrior.Arms:
                return { label: "Arms", classes: ['.warrior', '.arms'] }
            case Classes.Warrior.Fury:
                return { label: "Fury", classes: ['.warrior', '.fury'] }
            case Classes.Druid.Restoration:
                return { label: "Restoration", classes: ['.druid', '.restoration'] }
            case Classes.Monk.Mistweaver:
                return { label: "Mistweaver", classes: ['.monk', '.mistweaver'] }
            case Classes.Paladin.Holy:
                return { label: "Holy", classes: ['.paladin', '.holy'] }
            case Classes.Shaman.Restoration:
                return { label: "Restoration", classes: ['.shaman', '.restoration'] }
            case Classes.Priest.Discipline:
                return { label: "Discipline", classes: ['.priest', '.discipline'] }
            case Classes.Priest.Holy:
                return { label: "Holy", classes: ['.priest', '.holy'] }
            case Classes.DeathKnight.Blood:
                return { label: "Blood", classes: ['.deathknight', '.blood'] }
            case Classes.DemonHunter.Vengeance:
                return { label: "Vengeance", classes: ['.demonhunter', '.vengeance'] }
            case Classes.Druid.Guardian:
                return { label: "Guardian", classes: ['.druid', '.guardian'] }
            case Classes.Warrior.Protection:
                return { label: "Protection", classes: ['.warrior', '.protection'] }
            case Classes.Paladin.Protection:
                return { label: "Protection", classes: ['.paladin', '.protection'] }
        }
    },
    /**
     * @param {Race} race
     */
    RaceToObj: (race) => {
        switch (race) {
            case Races.Human:
                return { label: 'Human', classes: ['.human'] }
            case Races.Orc:
                return { label: 'Orc', classes: ['.prc'] }
            case Races.Dwarf:
                return { label: 'Dwarf', classes: ['.dwarf'] }
            case Races.NightElf:
                return { label: 'Night Elf', classes: ['.nightelf'] }
            case Races.Undead:
                return { label: 'Undead', classes: ['.undead'] }
            case Races.Tauren:
                return { label: 'Tauren', classes: ['.tauren'] }
            case Races.Gnome:
                return { label: 'Gnome', classes: ['.gnome'] }
            case Races.Troll:
                return { label: 'Troll', classes: ['.troll'] }
            case Races.Goblin:
                return { label: 'Goblin', classes: ['.goblin'] }
            case Races.BloodElf:
                return { label: 'BloodElf', classes: ['.bloodelf'] }
            case Races.Draenei:
                return { label: 'Draenei', classes: ['.draenei'] }
            case Races.Worgen:
                return { label: 'Worgen', classes: ['.worgen'] }
            case Races.PandarenN:
            case Races.PandarenA:
            case Races.PandarenH:
                return { label: 'Pandaren', classes: ['.pandaren'] }
            case Races.Nightborne:
                return { label: 'Nightborne', classes: ['.nightborne'] }
            case Races.HighmountainTauren:
                return { label: 'Highmountain Tauren', classes: ['.highmountaintauren'] }
            case Races.VoidElf:
                return { label: 'Void Elf', classes: ['.voidelf'] }
            case Races.LightforgedDraenei:
                return { label: 'Lightforged Draenei', classes: ['.lightforgeddraenei'] }
            case Races.ZandalariTroll:
                return { label: 'Zandalari Troll', classes: ['.zandalaritroll'] }
            case Races.KulTiran:
                return { label: 'Kul Tiran', classes: ['.kultiran'] }
            case Races.DarkIronDwarf:
                return { label: 'Dark Iron Dwarf', classes: ['.darkirondwarf'] }
            case Races.Vulpera:
                return { label: 'Vulpera', classes: ['.vulpera'] }
            case Races.MagharOrc:
                return { label: 'MagharOrc', classes: ['.magharorc'] }
            case Races.Mechagnome:
                return { label: 'Mechagnome', classes: ['.mechagnome'] }
        }
    },
    /**
     * @param {Gender} gender
     */
    GenderToObj: (gender) => {
        switch (gender) {
            case Genders.Female:
                return { label: "Female", classes: ['.female'] }
            case Genders.Male:
                return { label: "Male", classes: ['.male'] }
            default:
                return { label: "Unknown", classes: ['.unknown'] }
        }
    },
    /**
     * @param {Faction} faction
     */
    FactionToObj: (faction) => {
        switch (faction) {
            case Factions.Horde:
                return { label: "Horde", classes: ['.horde'] };
            case Factions.Alliance:
                return { label: "Alliance", classes: ['.alliance'] };
            case Factions.Unknown:
                return { label: "Unknown", classes: ['.unknown'] };
        }
    },
    /**
     * @param {Specs} spec
     */
    GetRoleBySpec: (spec) => {
        if (Specs.HEAL.indexOf(spec) >= 0)
            return CharacterRole.HEAL;
        if (Specs.TANK.indexOf(spec) >= 0)
            return CharacterRole.TANK;
        return CharacterRole.DPS;
    },
    /**
     * @param {CharacterRole} role
     */
    GetSpecsByRole: (role) => {
        switch (parseInt(role)) {
            case CharacterRole.HEAL:
                return Specs.HEAL;
            case CharacterRole.TANK:
                return Specs.TANK;
            case CharacterRole.DPS:
            default:
                return Enums.Characters.Specs.DPS;
        }
    },
}