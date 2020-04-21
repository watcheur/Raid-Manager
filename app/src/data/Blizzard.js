import classNames from "classnames";
import Context from '../utils/context'

const CharacterType = {
    MAIN: 0,
    ALT: 1,
    ALT_FUN: 2
};

const CharacterRole = {
    DPS: 0,
    HEAL: 1,
    TANK: 2,
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
        default:
            return { label: 'Unknown', slug: 'unknown' }
    }
}

const checker = (label, cl, rClass, rRole, rSpec, fn) => {
    return {
        label: label,
        classNames: classNames('GameColorClass', cl),
        count: (characters) => {
            if (fn)
                return (fn(characters).length);
            
            return characters.filter(c => {
                let verif = [ (c.class == rClass) ];

                if (rSpec !== undefined && !Array.isArray(rSpec) && rSpec >= 0)
                    verif.push(c.spec == rSpec)
                if (rSpec !== undefined && Array.isArray(rSpec)) {
                    let arrTestSpec = false;
                    rSpec.forEach(sp => {
                        if (!arrTestSpec)
                            arrTestSpec = (c.spec == sp)
                    })
                    verif.push(arrTestSpec);
                }

                if (rRole !== undefined && !Array.isArray(rRole) && rRole >= 0)
                    verif.push(c.role == rRole)
                if (rRole !== undefined && Array.isArray(rRole)) {
                    let arrTestRole = false;
                    rRole.forEach(sr => {
                        if (!arrTestRole)
                            arrTestRole = (c.role == sr)
                    })
                    verif.push(arrTestRole);
                }

                return verif.every(v => v)
            }).length
        }
    }
};

const buffs = [
    {
        label: 'Stamina',
        spells: [
            checker('Power Word: Fortitude', 'priest', Classes.Priest.ClassID)
        ]
    },
    {
        label: 'Attack Power',
        spells: [
            checker('Battle Shout', 'warrior', Classes.Warrior.ClassID)
        ]
    },
    {
        label: 'Intellect',
        spells: [
            checker('Arcane Intellect', 'mage', Classes.Mage.ClassID)
        ]
    }
]

const debuffs = [
    {
        label: 'Physical Damage Taken',
        spells: [
            checker('Mystic Touch', 'monk', Classes.Monk.ClassID)
        ]
    },
    {
        label: 'Magic Damage Taken',
        spells: [
            checker('Chaos Brand', 'demonhunter', Classes.DemonHunter.ClassID)
        ]
    }
];

const externalCooldowns = [
    {
        label: 'Immunities',
        spells: [
            checker('Blessing of Protection', 'paladin', Classes.Paladin.ClassID),
            checker('Blessing of Spellwarding', 'paladin', Classes.Paladin.ClassID, CharacterRole.TANK )
        ]
    },
    {
        label: 'Cheat Death',
        spells: [
            checker('Guardian Spirit', 'priest', Classes.Priest.ClassID, CharacterRole.HEAL, Classes.Priest.Holy),
            checker('Ancestral Protection Totem', 'shaman', Classes.Shaman.ClassID, CharacterRole.HEAL)
        ]
    },
    {
        label: 'Damage Mitigation',
        spells: [
            checker('Darkness', 'demonhunter', Classes.DemonHunter.ClassID),
            checker('Tranquility', 'druid', Classes.Druid.ClassID, CharacterRole.HEAL),
            checker('Revival', 'monk', Classes.Monk.ClassID, CharacterRole.HEAL),
            checker('Aura Mastery', 'paladin', Classes.Paladin.ClassID, CharacterRole.HEAL),
            checker('Divine Hymn', 'priest', Classes.Priest.ClassID, CharacterRole.HEAL, Classes.Priest.Holy),
            checker('Power Word: Barrier', 'priest', Classes.Priest.ClassID, CharacterRole.HEAL, Classes.Priest.Discipline),
            checker('Vampiric Embrace', 'priest', Classes.Priest.ClassID, CharacterRole.DPS),
            checker('Spirit Link Totem', 'shaman', Classes.Shaman.ClassID, CharacterRole.HEAL),
            checker('Healing Tide Totem', 'shaman', Classes.Shaman.ClassID, CharacterRole.HEAL),
            checker('Healing Stream Totem', 'shaman', Classes.Shaman.ClassID, CharacterRole.HEAL),
            checker('Rallying Cry', 'warrior', Classes.Warrior.ClassID)
        ]
    },
    {
        label: 'Movement Abilities',
        spells: [
            checker('Stampeding Roar', 'druid', Classes.Druid.ClassID, undefined, [ Classes.Druid.Feral, Classes.Druid.Guardian ]),
            checker('Blessing of Freedom', 'paladin', Classes.Paladin.ClassID),
            checker('Demonic Gateway', 'warlock', Classes.Warlock.ClassID)
        ]
    }
]

const personnalCooldowns = [
    {
        label: 'Immunities',
        spells: [
            checker('Aspect of the turtle', 'hunter', Classes.Paladin.ClassID),
            checker('Ice Block', 'mage', Classes.Mage.ClassID),
            checker('Divine shield', 'paladin', Classes.Paladin.ClassID),
            checker('Cloak of Shadows', 'rogue', Classes.Rogue.ClassID)
        ]
    }
]

const crowdControls = [
    {
        label: 'Incapacitates',
        spells: [
            checker('Control Undead', 'deathknight', Classes.DeathKnight.ClassID),
            checker('Imprison', 'demonhunter', Classes.DemonHunter.ClassID),
            checker('Hibernate', 'druid', Classes.Druid.ClassID),
            checker('Incapacitating Roar', 'druid', Classes.Druid.ClassID),
            checker('Freezing Trap', 'hunter', Classes.Hunter.ClassID),
            checker('Polymorph', 'mage', Classes.Mage.ClassID),
            checker('Paralysis', 'monk', Classes.Monk.ClassID),
            checker('Chastise', 'priest', Classes.Priest.ClassID, CharacterRole.HEAL, Classes.Priest.Holy),
            checker('Mond Control', 'priest', Classes.Priest.ClassID),
            checker('Shackle Undead', 'priest', Classes.Priest.ClassID),
            checker('Gouge', 'rogue', Classes.Rogue.ClassID),
            checker('Sap', 'rogue', Classes.Rogue.ClassID),
            checker('Hex', 'shaman', Classes.Shaman.ClassID),
            checker('Banish', 'warlock', Classes.Warlock.ClassID),
            checker('Enslave Demon', 'warlock', Classes.Warlock.ClassID),
            checker('Fear', 'warlock', Classes.Warlock.ClassID)
        ]
    },
    {
        label: 'Stuns',
        spells: [
            checker('Asphixiate', 'deathknight', Classes.DeathKnight.ClassID),
            checker('Chaos Nova', 'demonhunter', Classes.DemonHunter.ClassID),
            checker('Leg Sweep', 'monk', Classes.Monk.ClassID),
            checker('Hammer of Justice', 'paladin', Classes.Paladin.ClassID),
        ]
    },
    {
        label: 'Disorients',
        spells: [
            checker('Sigil of Misery', 'demonhunter', Classes.DemonHunter.ClassID, CharacterRole.TANK),
            checker('Dragon\'s Breath', 'mage', Classes.Mage.ClassID, CharacterRole.DPS, Classes.Mage.Fire),
            checker('Psychic Scream', 'priest', Classes.Priest.ClassID),
            checker('Intimidating Shout', 'warrior', Classes.Warrior.ClassID),
            checker('Blind', 'rogue', Classes.Rogue.ClassID),
        ]
    },
    {
        label: 'Disorients',
        spells: [
            checker('Entangling Roots', 'druid', Classes.Druid.ClassID),
            checker('Disable', 'monk', Classes.Monk.ClassID),
            checker('Frost nova', 'mage', Classes.Mage.ClassID, CharacterRole.DPS, Classes.Mage.Frost),
        ]
    },
];

const other = [
    {
        label: 'Bloodlust',
        spells: [
            checker('Primal Rage', 'hunter', Classes.Hunter.ClassID, CharacterRole.DPS, Classes.Hunter.BeastMastery),
            checker('Time Warp', 'mage', Classes.Mage.ClassID),
            checker('Heroism', 'shaman', Classes.Shaman.ClassID),
        ]
    },
    {
        label: 'Silences',
        spells: [
            checker('Sigil of Silence', 'demonhunter', Classes.DemonHunter.ClassID, CharacterRole.TANK),
            checker('Solar Beam', 'druid', Classes.Druid.ClassID, CharacterRole.DPS, Classes.Druid.Balance),
            checker('Silence', 'priest', Classes.Priest.ClassID, CharacterRole.DPS),
        ]
    },
    {
        label: 'Offensive Enrage Dispels',
        spells: [
            checker('Soothe', 'druid', Classes.Druid.ClassID),
            checker('Hunter', 'hunter', Classes.Hunter.ClassID, CharacterRole.DPS, Classes.Hunter.BeastMastery),
        ]
    },
    {
        label: 'Offensive Magic Dispels',
        spells: [
            checker('Consume Magic', 'demonhunter', Classes.DemonHunter.ClassID),
            checker('Spellsteal', 'mage', Classes.Mage.ClassID),
            checker('Dispel Magic', 'priest', Classes.Priest.ClassID),
            checker('Mass Dispel', 'priest', Classes.Priest.ClassID),
            checker('Purge', 'shaman', Classes.Shaman.ClassID),
        ]
    }, 
    {
        label: 'Friendly Magic Dispels',
        spells: [
            checker('Nature\'s Cure', 'druid', Classes.Druid.ClassID, CharacterRole.HEAL),
            checker('Detox', 'monk', Classes.Monk.ClassID),
            checker('Clease', 'paladin', Classes.Paladin.ClassID),
            checker('Mass Dispel', 'priest', Classes.Priest.ClassID),
            checker('Purify', 'priest', Classes.Priest.ClassID),
            checker('Purify Spirit', 'shaman', Classes.Shaman.ClassID),
        ]
    },  
    {
    label: 'Friendly Curse Dispels',
        spells: [
            checker('Nature\'s Cure', 'druid', Classes.Druid.ClassID, CharacterRole.HEAL),
            checker('Remove Corruption', 'druid', Classes.Druid.ClassID),
            checker('Remove Curse', 'mage', Classes.Mage.ClassID),
            checker('Cleanse Spirit', 'shaman', Classes.Shaman.ClassID),
            checker('Purify Spirit', 'shaman', Classes.Shaman.ClassID)
        ]
    }, 
    {
        label: 'Friendly Disease Dispels',
        spells: [
            checker('Detox', 'monk', Classes.Monk.ClassID, [CharacterRole.HEAL, CharacterRole.TANK]),
            checker('Cleanse', 'paladin', Classes.Paladin.ClassID, CharacterRole.HEAL),
            checker('Cleanse Toxins', 'paladin', Classes.Paladin.ClassID, [CharacterRole.HEAL, CharacterRole.TANK]),
            checker('Purify', 'priest', Classes.Priest.ClassID),
            checker('Purify Disease', 'priest', Classes.Priest.ClassID, CharacterRole.DPS),
        ]
    }, 
    {
        label: 'Friendly Poison Dispels',
        spells: [
            checker('Detox', 'monk', Classes.Monk.ClassID, [CharacterRole.HEAL, CharacterRole.TANK]),  
            checker('Nature\'s Cure', 'druid', Classes.Druid.ClassID, CharacterRole.HEAL),
            checker('Remove Corruption', 'druid', Classes.Druid.ClassID),
            checker('Cleanse', 'paladin', Classes.Paladin.ClassID, CharacterRole.HEAL),
            checker('Cleanse Toxins', 'paladin', Classes.Paladin.ClassID, [CharacterRole.HEAL, CharacterRole.TANK]),
        ]
    }, 
    {
        label: 'Battle Resurrections',
        spells: [
            checker('Raise Ally', 'deathknight', Classes.DeathKnight.ClassID),
            checker('Rebirth', 'druid', Classes.Druid.ClassID),
            checker('Soulstone', 'warlock', Classes.Warlock.ClassID),
        ]
    }, 
    {
        label: 'Short CD Interrupts',
        spells: [
            checker('Mind Freeze', 'deathknight', Classes.DeathKnight.ClassID),
            checker('Disrupt', 'demonhunter', Classes.DemonHunter.ClassID),
            checker('Skull Bash', 'druid', Classes.Druid.ClassID, undefined, [ Classes.Druid.Feral, Classes.Druid.Guardian ]),
            checker('Muzzle', 'hunter', Classes.Hunter.ClassID, CharacterRole.DPS, CharacterRole.Survival),
            checker('Spear Hand Strike', 'monk', Classes.Monk.ClassID),
            checker('Rebuke', 'paladin prot/ret', Classes.Paladin, [CharacterRole.DPS, CharacterRole.TANK]),
            checker('Kick', 'rogue', Classes.Rogue.ClassID),
            checker('Wind Shear', 'shaman', Classes.Shaman.ClassID),
            checker('Pummel', 'warrior', Classes.Warrior.ClassID),
        ]
    }, 
    {
        label: 'Long CD Interrupts',
        spells: [
            checker('Counter shot', 'hunter', Classes.Hunter.ClassID, CharacterRole.DPS, [Classes.Hunter.BeastMastery, Classes.Hunter.Marksmanship]),
            checker('Counterspell', 'mage', Classes.Mage.ClassID),
            checker('Silence', 'priest', Classes.Priest.ClassID, CharacterRole.DPS)
        ]
    }
]

const raidDifficulties = {
    LFR: 0,
    Normal: 1,
    Heroic: 2,
    Mythic: 3
}

export default {
    Characters: {
        Type: CharacterType,
        Role: CharacterRole,
        Classes: Classes,
        TankClasses: [ Classes.DeathKnight.ClassID, Classes.Druid.ClassID, Classes.Warrior.ClassID, Classes.DemonHunter.ClassID, Classes.Paladin.ClassID, Classes.Monk.ClassID ],
        HealClasses: [ Classes.Druid.ClassID, Classes.Monk.ClassID, Classes.Paladin.ClassID, Classes.Priest.ClassID, Classes.Shaman.ClassID ],
        Specs: Specs,
        Race: Races,
        Gender: Genders,
        Faction: Factions
    },
    Raids: {
        Difficulties: raidDifficulties
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
            default:
        }
        return { label: "Unknown", classes: ['unknown'] }
    },
    /**
     * @param {CharacterRole} role
     */
    RoleToObj: (role) => {
        switch (role) {
            case CharacterRole.DPS:
                return { label: "Dps", slug: "dps" }
            case CharacterRole.HEAL:
                return { label: "Heal", slug: "heal" }
            case CharacterRole.TANK:
                return { label: "Tank", slug: "tank" }
            default:
        }
        return { label: "Unknown", slug: 'unknown' }
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
        }
        return { label: "Unknown", slug: 'unknown' }
    },
    /**
     * @param {Specs} spec
     */
    SpecToObj: (spec) => {
        switch (spec) {
            case Classes.DeathKnight.Frost:
                return { label: "Frost", class: 'deathknight-frost', range: false }
            case Classes.DeathKnight.Unholy:
                return { label: "Unholy", class: 'deathknight-unholy', range: false }
            case Classes.DemonHunter.Havoc:
                return { label: "Havoc", class: 'demonhunter-havoc', range: false }
            case Classes.Druid.Balance:
                return { label: "Balance", class: 'druid-balance', range: true }
            case Classes.Druid.Feral:
                return { label: "Feral", class: 'druid-feral', range: false }
            case Classes.Hunter.BeastMastery:
                return { label: "BeastMastery", class: 'hunter-beastMastery', range: true }
            case Classes.Hunter.Marksmanship:
                return { label: "Marksmanship", class: 'hunter-marksmanship', range: true }
            case Classes.Hunter.Survival:
                return { label: "Survival", class: 'hunter-survival', range: false }
            case Classes.Mage.Arcane:
                return { label: "Arcane", class: 'mage-arcane', range: true }
            case Classes.Mage.Frost:
                return { label: "Frost", class: 'mage-frost', range: true }
            case Classes.Mage.Fire:
                return { label: "Fire", class: 'mage-fire', range: true }
            case Classes.Monk.Windwalker:
                return { label: "Windwalker", class: 'monk-windwalker', range: false }
            case Classes.Paladin.Retribution:
                return { label: "Retribution", class: 'paladin-retribution', range: false }
            case Classes.Priest.Shadow:
                return { label: "Shadow", class: 'priest-shadow', range: true }
            case Classes.Rogue.Assassination:
                return { label: "Assassination", class: 'rogue-assassination', range: false }
            case Classes.Rogue.Outlaw:
                return { label: "Outlaw", class: 'rogue-outlaw', range: false }
            case Classes.Rogue.Subtlety:
                return { label: "Subtlety", class: 'rogue-subtlety', range: false }
            case Classes.Shaman.Elemental:
                return { label: "Elemental", class: 'shaman-elemental', range: true }
            case Classes.Shaman.Enhancement:
                return { label: "Enhancement", class: 'shaman-enhancement', range: false }
            case Classes.Warlock.Affliction:
                return { label: "Affliction", class: 'warlock-affliction', range: true }
            case Classes.Warlock.Demonology:
                return { label: "Demonology", class: 'warlock-demonology', range: true }
            case Classes.Warlock.Destruction:
                return { label: "Destruction", class: 'warlock-destruction', range: true }
            case Classes.Warrior.Arms:
                return { label: "Arms", class: 'warrior-arms', range: false }
            case Classes.Warrior.Fury:
                return { label: "Fury", class: 'warrior-fury', range: false }
            case Classes.Druid.Restoration:
                return { label: "Restoration", class: 'druid-restoration', range: true }
            case Classes.Monk.Mistweaver:
                return { label: "Mistweaver", class: 'monk-mistweaver', range: true }
            case Classes.Paladin.Holy:
                return { label: "Holy", class: 'paladin-holy', range: true }
            case Classes.Shaman.Restoration:
                return { label: "Restoration", class: 'shaman-restoration', range: true }
            case Classes.Priest.Discipline:
                return { label: "Discipline", class: 'priest-discipline', range: true }
            case Classes.Priest.Holy:
                return { label: "Holy", class: 'priest-holy', range: true }
            case Classes.DeathKnight.Blood:
                return { label: "Blood", class: 'deathknight-blood', range: false }
            case Classes.DemonHunter.Vengeance:
                return { label: "Vengeance", class: 'demonhunter-vengeance', range: false }
            case Classes.Druid.Guardian:
                return { label: "Guardian", class: 'druid-guardian', range: false }
            case Classes.Warrior.Protection:
                return { label: "Protection", class: 'warrior-protection', range: false }
            case Classes.Paladin.Protection:
                return { label: "Protection", class: 'paladin-protection', range: false }
            default:
        }
        return { label: "Unknown", slug: 'unknown', range: false }
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
            default:
        }
        return { label: "Unknown", classes: ['unknown'] };
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
            case Classes.Warrior.ClassID:
                return "#C79C6E";
            case Classes.Warlock.ClassID:
                return "#8787ED";
            case Classes.Shaman.ClassID:
                return "#0070DE";
            case Classes.Rogue.ClassID:
                return "#FFF569";
            case Classes.Priest.ClassID:
                return "#FFFFFF";
            case Classes.Paladin.ClassID:
                return "#F58CBA";
            case Classes.Monk.ClassID:
                return "#00FF96";
            case Classes.Mage.ClassID:
                return "#40C7EB";
            case Classes.Hunter.ClassID:
                return "#ABD473";
            case Classes.Druid.ClassID:
                return "#FF7D0A";
            case Classes.DeathKnight.ClassID:
                return "#C41F3B";
            case Classes.DemonHunter.ClassID:
                return "#A330C9";
            default:
                return "#FFFFFF";
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
        if (ilvl >= Context.Options.artifact_ilvl)
            return 'artifact';
        if (ilvl >= Context.Options.legendary_ilvl)
            return 'legendary';
        if (ilvl >= Context.Options.epic_ilvl)
            return 'epic';
        if (ilvl >= Context.Options.rare_ilvl)
            return 'rare';
        if (ilvl >= Context.Options.uncommon_ilvl)
            return 'uncommon';
        if (ilvl >= Context.Options.common_ilvl)
            return 'common';
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
    },
    DifficultyToClass: (diff) => {
        switch (diff) {
            case raidDifficulties.LFR: return 'lfr';
            case raidDifficulties.Normal: return 'normal';
            case raidDifficulties.Heroic: return 'heroic';
            case raidDifficulties.Mythic: return 'mythic';
            default:
        }

        return '';
    },
    GetUtilities: () => {
        return [
            { label: 'Buffs', data: buffs},
            { label: 'Debuffs', data: debuffs },
            { label: 'External Cooldowns', data: externalCooldowns },
            { label: 'Personnal Cooldowns', data: personnalCooldowns },
            { label: 'Crowd Control', data: crowdControls },
            { label: 'Other', data: other }
        ];
    }
}