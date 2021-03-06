module.exports = {
    name: "Player",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            nullable: true
        },
        rank: {
            type: "int"
        }
    },
    relations: {
        characters: {
            target: "Character",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'player'
            },
            inverseSide: 'player'
        }
    }
};