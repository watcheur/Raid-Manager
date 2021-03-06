module.exports = {
    name: "Composition",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
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
        encounter: {
            target: "Encounter",
            type: "many-to-one",
            joinColumn: {
                name: 'encounter',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
        characters: {
            target: "CharacterComp",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'composition'
            },
            inverseSide: 'composition'
        },
        event: {
            target: "Event",
            type: "many-to-one",
            joinColumn: {
                name: 'event',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
        note: {
            target: "Note",
            type: "one-to-one",
            joinColumn: {
                name: 'note',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: "CASCADE"
        }
    },
    indices: [
        {
            name: "IDX_ENCOUNTER",
            columns: [
                "encounter"
            ]
        },
        {
            name: "IDX_EVENT",
            columns: [
                "event"
            ]
        }
    ]
}