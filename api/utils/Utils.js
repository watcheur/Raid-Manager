const Enums = require('./Enums');

module.exports = {
    GetRoleBySpec: (spec) => {
        if (Enums.Characters.Specs.HEAL.indexOf(spec) >= 0)
            return Enums.Characters.Role.HEAL;
        if (Enums.Characters.Specs.TANK.indexOf(spec) >= 0)
            return Enums.Characters.Role.TANK;
        return Enums.Characters.Role.DPS;
    },

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
    }
}