module.exports = {
    name: "Boss",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        boss: {
            type: "int"
        }
    },
    relations: {
        characters: {
            target: "Character",
            type: "many-to-many",
            joinTable: true,
            cascade: false
        }
    }
}