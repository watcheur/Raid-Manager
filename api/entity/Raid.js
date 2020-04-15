module.exports = {
    name: "Raid",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        zone: {
            type: "int"
        },
        difficulty: {
            type: "tinyint"
        },
        date: {
            type: "datetime"
        }
    },
    relations: {
        bosses: {
            target: "Boss",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        }
    }
}