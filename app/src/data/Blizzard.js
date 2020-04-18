import Context from '../utils/context'

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

function GenderToObj(gender) {
    switch (gender) {
        case Genders.Female:
            return { label: "Female", slug: 'female' }
        case Genders.Male:
            return { label: "Male", slug: 'male' }
        default:
            return { label: "Unknown", slug: 'unknown' }
    }
}

function RaceToObj(race) {
    switch (race) {
        case Races.Human:
            return { label: 'Human', slug: 'human' }
        case Races.Orc:
            return { label: 'Orc', slug: 'orc' }
        case Races.Dwarf:
            return { label: 'Dwarf', slug: 'dwarf' }
        case Races.NightElf:
            return { label: 'Night Elf', slug: 'nightelf' }
        case Races.Undead:
            return { label: 'Undead', slug: 'undead' }
        case Races.Tauren:
            return { label: 'Tauren', slug: 'tauren' }
        case Races.Gnome:
            return { label: 'Gnome', slug: 'gnome' }
        case Races.Troll:
            return { label: 'Troll', slug: 'troll' }
        case Races.Goblin:
            return { label: 'Goblin', slug: 'goblin' }
        case Races.BloodElf:
            return { label: 'BloodElf', slug: 'bloodelf' }
        case Races.Draenei:
            return { label: 'Draenei', slug: 'draenei' }
        case Races.Worgen:
            return { label: 'Worgen', slug: 'worgen' }
        case Races.PandarenN:
        case Races.PandarenA:
        case Races.PandarenH:
            return { label: 'Pandaren', slug: 'pandaren' }
        case Races.Nightborne:
            return { label: 'Nightborne', slug: 'nightborne' }
        case Races.HighmountainTauren:
            return { label: 'Highmountain Tauren', slug: 'highmountaintauren' }
        case Races.VoidElf:
            return { label: 'Void Elf', slug: 'voidelf' }
        case Races.LightforgedDraenei:
            return { label: 'Lightforged Draenei', slug: 'lightforgeddraenei' }
        case Races.ZandalariTroll:
            return { label: 'Zandalari Troll', slug: 'zandalaritroll' }
        case Races.KulTiran:
            return { label: 'Kul Tiran', slug: 'kultiran' }
        case Races.DarkIronDwarf:
            return { label: 'Dark Iron Dwarf', slug: 'darkirondwarf' }
        case Races.Vulpera:
            return { label: 'Vulpera', slug: 'vulpera' }
        case Races.MagharOrc:
            return { label: 'MagharOrc', slug: 'magharorc' }
        case Races.Mechagnome:
            return { label: 'Mechagnome', slug: 'mechagnome' }
    }
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
                return { label: "Dps", slug: "damage" }
            case CharacterRole.HEAL:
                return { label: "Heal", slug: "healer" }
            case CharacterRole.TANK:
                return { label: "Tank", slug: "tank" }
        }
    },
    /**
     * @param {Classes} cl
     */
    ClassToObj: (cl) => {
        switch (cl) {
            case Classes.Warrior.ClassID:
                return { label: "Warrior", slug: 'warrior' }
            case Classes.Warlock.ClassID:
                return { label: "Warlock", slug: 'warlock' }
            case Classes.Shaman.ClassID:
                return { label: "Shaman", slug: 'shaman' }
            case Classes.Rogue.ClassID:
                return { label: "Rogue", slug: 'rogue' }
            case Classes.Priest.ClassID:
                return { label: "Priest", slug: 'priest' }
            case Classes.Paladin.ClassID:
                return { label: "Paladin", slug: 'paladin' }
            case Classes.Monk.ClassID:
                return { label: "Monk", slug: 'monk' }
            case Classes.Mage.ClassID:
                return { label: "Mage", slug: 'mage' }
            case Classes.Hunter.ClassID:
                return { label: "Hunter", slug: 'hunter' }
            case Classes.Druid.ClassID:
                return { label: "Druid", slug: 'druid' }
            case Classes.DeathKnight.ClassID:
                return { label: "DeathKnight", slug: 'deathknight' }
            case Classes.DemonHunter.ClassID:
                return { label: "DemonHunter", slug: 'demonhunter' }
            default:
                return { label: "Unknown", slug: 'unknown' }
        }
    },
    /**
     * @param {Specs} spec
     */
    SpecToObj: (spec) => {
        switch (spec) {
            case Classes.DeathKnight.Frost:
                return { label: "Frost", class: 'deathknight-frost' }
            case Classes.DeathKnight.Unholy:
                return { label: "Unholy", class: 'deathknight-unholy' }
            case Classes.DemonHunter.Havoc:
                return { label: "Havoc", class: 'demonhunter-havoc' }
            case Classes.Druid.Balance:
                return { label: "Balance", class: 'druid-balance' }
            case Classes.Druid.Feral:
                return { label: "Feral", class: 'druid-feral' }
            case Classes.Hunter.BeastMastery:
                return { label: "BeastMastery", class: 'hunter-beastMastery' }
            case Classes.Hunter.Marksmanship:
                return { label: "Marksmanship", class: 'hunter-marksmanship' }
            case Classes.Hunter.Survival:
                return { label: "Survival", class: 'hunter-survival' }
            case Classes.Mage.Arcane:
                return { label: "Arcane", class: 'mage-arcane' }
            case Classes.Mage.Frost:
                return { label: "Frost", class: 'mage-frost' }
            case Classes.Mage.Fire:
                return { label: "Fire", class: 'mage-fire' }
            case Classes.Monk.Windwalker:
                return { label: "Windwalker", class: 'monk-windwalker' }
            case Classes.Paladin.Retribution:
                return { label: "Retribution", class: 'paladin-retribution' }
            case Classes.Priest.Shadow:
                return { label: "Shadow", class: 'priest-shadow' }
            case Classes.Rogue.Assassination:
                return { label: "Assassination", class: 'rogue-assassination' }
            case Classes.Rogue.Outlaw:
                return { label: "Outlaw", class: 'rogue-outlaw' }
            case Classes.Rogue.Subtlety:
                return { label: "Subtlety", class: 'rogue-subtlety' }
            case Classes.Shaman.Elemental:
                return { label: "Elemental", class: 'shaman-elemental' }
            case Classes.Shaman.Enhancement:
                return { label: "Enhancement", class: 'shaman-enhancement' }
            case Classes.Warlock.Affliction:
                return { label: "Affliction", class: 'warlock-affliction' }
            case Classes.Warlock.Demonology:
                return { label: "Demonology", class: 'warlock-demonology' }
            case Classes.Warlock.Destruction:
                return { label: "Destruction", class: 'warlock-destruction' }
            case Classes.Warrior.Arms:
                return { label: "Arms", class: 'warrior-arms' }
            case Classes.Warrior.Fury:
                return { label: "Fury", class: 'warrior-fury' }
            case Classes.Druid.Restoration:
                return { label: "Restoration", class: 'druid-restoration' }
            case Classes.Monk.Mistweaver:
                return { label: "Mistweaver", class: 'monk-mistweaver' }
            case Classes.Paladin.Holy:
                return { label: "Holy", class: 'paladin-holy' }
            case Classes.Shaman.Restoration:
                return { label: "Restoration", class: 'shaman-restoration' }
            case Classes.Priest.Discipline:
                return { label: "Discipline", class: 'priest-discipline' }
            case Classes.Priest.Holy:
                return { label: "Holy", class: 'priest-holy' }
            case Classes.DeathKnight.Blood:
                return { label: "Blood", class: 'deathknight-blood' }
            case Classes.DemonHunter.Vengeance:
                return { label: "Vengeance", class: 'demonhunter-vengeance' }
            case Classes.Druid.Guardian:
                return { label: "Guardian", class: 'druid-guardian' }
            case Classes.Warrior.Protection:
                return { label: "Protection", class: 'warrior-protection' }
            case Classes.Paladin.Protection:
                return { label: "Protection", class: 'paladin-protection' }
        }
    },
    /**
     * @param {Race} race
     */
    RaceToObj: RaceToObj,
    /**
     * @param {Gender} gender
     */
    GenderToObj: GenderToObj,
    CharToRaceIc: (char) => {
        return `GameIcon--${RaceToObj(char.race).slug}_${GenderToObj(char.gender).slug}`
    },
    /**
     * @param {Faction} faction
     */
    FactionToObj: (faction) => {
        switch (faction) {
            case Factions.Horde:
                return { label: "Horde", classes: ['horde'] };
            case Factions.Alliance:
                return { label: "Alliance", classes: ['alliance'] };
            case Factions.Unknown:
                return { label: "Unknown", classes: ['unknown'] };
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
                return CharacterRole.Specs.DPS;
        }
    },
    /**
     * @param {Classes} cl
     */
    ClassToColor: (cl) => {
        switch (cl) {
            case Classes.Warrior:
                return "#C79C6E";
            case Classes.Warlock:
                return "#8787ED";
            case Classes.Shaman:
                return "#0070DE";
            case Classes.Rogue:
                return "#FFF569";
            case Classes.Priest:
                return "#FFFFFF";
            case Classes.Paladin:
                return "#F58CBA";
            case Classes.Monk:
                return "#00FF96";
            case Classes.Mage:
                return "#40C7EB";
            case Classes.Hunter:
                return "#ABD473";
            case Classes.Druid:
                return "#FF7D0A";
            case Classes.DeathKnight:
                return "#C41F3B";
            case Classes.DemonHunter:
                return "#A330C9";
            default:
                return "#000000";
        }
    },
    /**
     * @param {Number} azerite
     */
    AzeriteToClass: (azerite) => {
        if (azerite == null)
            return 'poor';
        if (azerite <= 50)
            return 'common';
        if (azerite <= 70)
            return 'rare';
        if (azerite <= 80)
            return 'epic';
        if (azerite <= 85)
            return 'legendary';
        if (azerite > 85)
            return 'artifact';
    },
    /**
     * @param {Number} ilvl
     */
    IlvlToClass: (ilvl) => {
        if (ilvl >= Context.Options.legendary_ilvl)
            return 'legendary';
        if (ilvl >= Context.Options.epic_ilvl)
            return 'epic';
        if (ilvl >= Context.Options.rare_ilvl)
            return 'rare';
        if (ilvl >= Context.Options.uncommon_ilvl)
            return 'uncommon';
        if (ilvl >= Context.Options.poor_ilvl)
            return 'poor';
        return 'poor';
    },
    /**
     * @param {String} val
     */
    TrSlot: (val) => {
        switch (val) {
            case 'Hand': return 'hands';
            case 'Foot': return 'feet';
            case 'Leg': return 'legs';
            case 'LeftFinger': return 'finger_1';
            case 'RightFinger': return 'finger_2';
            case 'LeftTrinket': return 'trinket_1';
            case 'RightTrinket': return 'trinket_2';
            case 'Weapon': return 'main_hand';
            case 'Offhand': return 'off_hand';
            default: return val.toLowerCase();
        }
    }
}