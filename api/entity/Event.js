module.exports = {
    name: "Event",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar",
            length: 50
        },
        schedule: {
            type: "datetime"
        },
        difficulty: {
            type: "tinyint"
        },
        created: {
            type: "datetime"
        },
        updated: {
            type: "datetime",
            nullable: true
        }
    },
    relations: {
        raid: {
            target: "Raid",
            type: "many-to-one",
            joinColumn: {
                name: 'raid',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
        },
        compositions: {
            target: "Composition",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'event'
            },
            inverseSide: 'event',
            cascade: true,
            onDelete: 'CASCADE'
        },
        logs: {
            target: "Log",
            type: "one-to-many",
            joinColumn: {
                name: 'logs',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true
        }
    }
}