module.exports = {
    name: "Note",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar",
            nullable: true
        },
        text: {
            type: "text",
            nullable: true
        },
        favorite: {
            type: "boolean",
            default: false
        }
    }
};