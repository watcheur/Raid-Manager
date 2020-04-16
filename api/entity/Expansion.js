module.exports = {
    name: "Expansion",
    columns: {
        id: {
            primary: true,
            type: "int"
        },
        name: {
            type: "varchar"
        }
    },
    relations: {
        raids: {
            target: "Raid",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'expansion'
            },
            inverseSide: 'expansion',
            cascade: false
        }
    }
}