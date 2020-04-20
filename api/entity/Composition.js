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
            type: "one-to-one",
            joinColumn: {
                name: 'encounter',
                referencedColumnName: 'id'
            },
            inverseSide: 'id'
        },
        characters: {
            target: "CharacterComp",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'composition'
            },
            inverseSide: 'composition',
            cascade: true,
            onDelete: 'CASCADE'
        },
        event: {
            target: "Event",
            type: "many-to-one",
            joinColumn: {
                name: 'event',
                referencedColumnName: 'id'
            },
            inverseSide: 'id'
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
    }
}