module.exports = {
    name: "Encounter",
    columns: {
        id: {
            primary: true,
            type: "int"
        },
        name: {
            type: "varchar"
        },
        order: {
            type: "int",
            default: 0
        }
    },
    relations: {
        raid: {
            target: "Raid",
            type: "many-to-one",
            joinColumn: {
                name: 'raid',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        }
    }
}