module.exports = {
    name: "Item",
    columns: {
        id: {
            primary: true,
            type: "int"
        },
        slot: {
            type: "varchar" /* HEAD, NECK, ...*/
        },
        quality: {
            type: "varchar" /* EPIC, ARTIFACT, COMMON, ... */
        },
        level : {
            type: "int",
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
        source: {
            target: "Encounter",
            type: "many-to-one",
            joinColumn: {
                name: 'source',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        }
    }
};