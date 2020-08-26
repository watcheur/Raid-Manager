module.exports = {
    name: "Character",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 12
        },
        realm: {
            type: "varchar",
            length: 50
        },
        type: {
            type: "tinyint"
        },
        level: {
            type: "int",
            nullable: true
        },
        race: {
            type: "int",
            nullable: true
        },
        gender: {
            type: "int",
            nullable: true
        },
        faction: {
            type: "int",
            nullable: true
        },
        class: {
            type: "int",
            nullable: true
        },
        spec: {
            type: "int",
            nullable: true
        },
        azerite: {
            type: "int",
            nullable: true
        },
        avg: {
            type: "int",
            nullable: true
        },
        equipped: {
            type: "int",
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
        dungeons: {
            target: "Weekly",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'character'
            },
            inverseSide: 'character'
        },
        compositions: {
            target: "CharacterComp",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'character'
            },
            inverseSide: 'character'
        },
        player: {
            target: "Player",
            type: "many-to-one",
            type: "many-to-one",
            joinColumn: {
                name: 'player',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
        items: {
            target: "CharacterItem",
            type: "one-to-many",
            joinColumn: {
                name: 'id',
                referencedColumnName: 'character'
            },
            inverseSide: 'character'
        }
    },
    indices: [
        {
            name: "IDX_CLASS",
            columns: [
                "class"
            ]
        },
        {
            name: "IDX_SPEC",
            columns: [
                "spec"
            ]
        },
        {
            name: "IDX_NAME",
            columns: [
                "name"
            ]
        },
        {
            name: "IDX_LEVEL",
            columns: [
                "level"
            ]
        }
    ]
};