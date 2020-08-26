module.exports = {
    name: "Realm",
    columns: {
        id: {
            primary: true,
            type: "int",
            unique: true
        },
        name: {
            type: "varchar",
            length: 40
        },
        slug: {
            type: "varchar",
            length: 40
        },
        category: {
            type: "varchar",
            length: 15
        }
    },
    indices: [
        {
            name: "IDX_NAME",
            columns: [
                "name"
            ]
        }
    ]
};