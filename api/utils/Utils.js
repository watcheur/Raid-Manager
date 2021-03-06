const Enums = require('./Enums');

function GetRoleBySpec(spec) {
    if (Enums.Characters.Specs.HEAL.indexOf(spec) >= 0)
        return Enums.Characters.Role.HEAL;
    if (Enums.Characters.Specs.TANK.indexOf(spec) >= 0)
        return Enums.Characters.Role.TANK;
    return Enums.Characters.Role.DPS;
}

module.exports = {
    GetRoleBySpec: GetRoleBySpec,

    GetSpecsByRole: (role) => {
        switch (parseInt(role)) {
            case Enums.Characters.Role.HEAL:
                return Enums.Characters.Specs.HEAL;
            case Enums.Characters.Role.TANK:
                return Enums.Characters.Specs.TANK;
            case Enums.Characters.Role.DPS:
            default:
                return Enums.Characters.Specs.DPS;
        }
    },

    TransformsCharCompToChar: (chars) => {
        return chars.map(c => {
            return {
                id: c.character.id,
                name: c.character.name,
                realm: c.character.realm,
                faction: c.character.faction,
                race: c.character.race,
                gender: c.character.gender,
                class: c.character.class,
                spec: c.character.spec,
                role: c.role
            }
        });
    },

    CharToCharRet: (char, weekly) => {
        char.role = GetRoleBySpec(char.spec);
        //c.dungeons = c.dungeons.filter(d => d.period >= Context.CurrentPeriod.id - 3);
        if (char.dungeons)
            char.weekly = Math.max.apply(Math, char.dungeons.filter(d => d.period >= weekly).map(d => d.level));

        if (char.items)
        {
            char.items = char.items.map(it => {
                return it.item ? {
                    id: it.item.id,
                    name: it.item.name,
                    slot: it.slot,
                    quality: it.quality,
                    level: it.level,
                    sockets: it.sockets,
                    bonuses: it.bonuses,
                    enchantments: it.enchantments,
                    missing_enchantment: (['FINGER_1', 'FINGER_2'].indexOf(it.slot) >= 0 && !it.enchantments),
                    missing_socket: (it.sockets != null && it.sockets === '0')
                } : {};
            })
        }

        return char;
    }
}