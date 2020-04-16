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
                name: 'boss',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: "CASCADE"
        },
        characters: {
            target: "CharacterComp",
            type: "many-to-many",
            joinColumn: {
                name: 'characters',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
        },
        event: {
            target: "Event",
            type: "many-to-one",
            joinColumn: {
                name: 'event',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
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