module.exports = {
    name: "Weekly",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        period: {
            type: "int"
        },
        level: {
            type: "int"
        },
        zone: {
            type: "int"
        },
        timed: {
            type: "bool"
        },
        timestamp: {
            type: "bigint"
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
        }
    },
    indices: [
        {
            name: "IDX_CHAR",
            columns: [
                "character"
            ]
        }
    ]
}