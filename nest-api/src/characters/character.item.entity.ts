import { Item, ItemQuality, ItemSlot } from 'src/items/item.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Character } from './character.entity';

@Entity()
export class CharacterItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slot: ItemSlot;

    @Column()
    quality: ItemQuality;

    @Column()
    level: number;

    @Column("simple-array", { nullable: true })
    bonuses?: string[];

    @Column("simple-array", { nullable: true })
    sockets?: string[];

    @Column("simple-array", { nullable: true })
    enchantments?: string[];

    @ManyToOne(type => Item, item => item.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item' })
    item: Item;

    @ManyToOne(type => Character, character => character.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'character' })
    character: Character;
    
    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}