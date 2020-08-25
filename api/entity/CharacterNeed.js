module.exports = {
    name: "CharacterNeed",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        difficulty: {
            type: "int"
        }
    },
    relations: {
        item: {
            target: "Item",
            type: "many-to-one",
            joinColumn: {
                name: 'item',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
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
        }
    }
};