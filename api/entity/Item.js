module.exports = {
    name: "Item",
    columns: {
        id: {
            primary: true,
            type: "int"
        },
        name: {
            type: "varchar",
            nullable: true
        },
        slot: {
            type: "varchar", /* HEAD, NECK, ...*/
            nullable: true
        },
        quality: {
            type: "varchar", /* EPIC, ARTIFACT, COMMON, ... */
            nullable: true
        },
        level : {
            type: "int",
            nullable: true
        },
        media: {
            type: "varchar",
            nullable: true
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