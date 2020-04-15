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
        head: {
            type: "int",
            nullable: true
        },
        neck: {
            type: "int",
            nullable: true
        },
        shoulder: {
            type: "int",
            nullable: true
        },
        back: {
            type: "int",
            nullable: true
        },
        chest: {
            type: "int",
            nullable: true
        },
        wrist: {
            type: "int",
            nullable: true
        },
        hands: {
            type: "int",
            nullable: true
        },
        waist: {
            type: "int",
            nullable: true
        },
        legs: {
            type: "int",
            nullable: true
        },
        feet: {
            type: "int",
            nullable: true
        },
        finger_1: {
            type: "int",
            nullable: true
        },
        finger_2: {
            type: "int",
            nullable: true
        },
        trinket_1: {
            type: "int",
            nullable: true
        },
        trinket_2: {
            type: "int",
            nullable: true
        },
        main_hand: {
            type: "int",
            nullable: true
        },
        off_hand: {
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
    }
};