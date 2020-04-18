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

    CharToCharRet: (char) => {
        char.role = GetRoleBySpec(char.spec);
        //c.dungeons = c.dungeons.filter(d => d.period >= Context.CurrentPeriod.id - 3);
        if (char.dungeons)
            char.weekly = Math.max.apply(Math, char.dungeons.map(d => d.level));

        return char;
    }
}