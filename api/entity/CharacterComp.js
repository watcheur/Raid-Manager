module.exports = {
    name: "CharacterComp",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        role: {
            type: "int"
        }
    },
    relations: {
        character: {
            target: "Character",
            type: "many-to-one",
            joinColumn: {
                name: 'character',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
        composition: {
            target: "Composition",
            type: "many-to-one",
            joinColumn: {
                name: 'composition',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
    }
}