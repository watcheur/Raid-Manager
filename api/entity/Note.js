module.exports = {
    name: "Note",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        text: {
            type: "text",
            nullable: true
        }
    }
};