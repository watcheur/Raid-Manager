import { Character } from "src/characters/character.entity";
import { Item } from "src/items/item.entity";
import { RaidDifficulty } from "src/raids/raid.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Index("idx_need_unique", [ "difficulty", "item", "character" ], { unique: true })
@Entity()
export class Wish
{
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    difficulty: RaidDifficulty;

    @Index()
    @ManyToOne(type => Item, item => item.id, { cascade: true })
    @JoinColumn({ name: 'item' })
    item: Item | number;

    @Index()
    @ManyToOne(type => Character, character => character.id, { cascade: true })
    @JoinColumn({ name: 'character' })
    character: Character | number;
}