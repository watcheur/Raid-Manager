module.exports = {
    name: "CharacterItem",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        slot: {
            type: "varchar"
        },
        quality: {
            type: "varchar" /* EPIC, ARTIFACT, COMMON, ... */
        },
        level : {
            type: "int",
        },
        bonuses: {
            type: "varchar", /* colon (:) separated bonuses */
            nullable: true
        },
        sockets: {
            type: "varchar", /* NULL if no sockets, 0 if unsocketed, id if socketed */
            nullable: true
        },
        enchantments: {
            type: "varchar", /* NULL if no enchants possible, 0 if not enchanted, enchant spell id if enchanted */ 
            nullable: true
        }
    },
    relations: {
        item: {
            target: "Item",
            type: "many-to-one",
            joinColumn: {
                name: 'item',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        },
        character: {
            target: "Character",
            type: "many-to-one",
            joinColumn: {
                name: 'character',
                referencedColumnName: 'id'
            },
            inverseSide: 'id',
            cascade: true,
            onDelete: 'CASCADE'
        }
    }
};