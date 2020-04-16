module.exports = {
    name: "Raid",
    columns: {
        id: {
            primary: true,
            type: "int"
        },
        name: {
            type: "varchar"
        },
        minimum_level: {
            type: "int"
        }
    },
    relations: {
        expansion: {
            target: "Expansion",
            type: "many-to-one",
            joinColumn: {
                name: 'expansion',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
        encounters: {
            target: "Encounter",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'raid'
            },
            inverseSide: 'raid',
            cascade: true,
            onDelete: "CASCADE"
        }
    }
}