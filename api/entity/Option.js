module.exports = {
    name: "Option",
    columns: {
        key: {
            primary: true,
            type: "varchar",
            unique: true
        },
        value: {
            type: "text",
            nullable: true
        },
    }
};