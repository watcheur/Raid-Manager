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
            joinColum: {
                name: 'character'
            },
            cascade: true
        }
    }
}