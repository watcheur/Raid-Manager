module.exports = {
    name: "Log",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        log: {
            type: "varchar",
            maxlength: 255
        }
    },
    relations: {
        event: {
            target: "Event",
            type: "one-to-one",
            joinColumn: {
                name: 'event',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: "CASCADE"
        }
    }
};