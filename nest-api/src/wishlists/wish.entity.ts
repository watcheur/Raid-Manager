import { Character } from "src/characters/character.entity";
import { Item } from "src/items/item.entity";
import { RaidDifficulty } from "src/raids/raid.entity";
import { Team } from "src/teams/team.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Unique("idx_need", [ "difficulty", "item", "character", "team" ])
@Entity()
export class Wish
{
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    difficulty: RaidDifficulty;

    @ManyToOne(type => Item, item => item.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item' })
    item: Item;

    @Index()
    @Column({ name: 'item' })
    itemId: number

    @ManyToOne(type => Character, character => character.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'character' })
    character: Character;
    
    @ManyToOne(type => Team, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team' })
    team: Team;

    @Index()
    @Column({ name: 'character' })
    characterId: number;
}