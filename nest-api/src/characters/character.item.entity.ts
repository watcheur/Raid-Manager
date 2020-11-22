import { Exclude, Expose } from 'class-transformer';
import { Item, ItemQuality, ItemSlot } from 'src/items/item.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';
import { Character } from './character.entity';
import { CharacterItemSlot, intellClasses, intellSpecs, agiClasses, agiSpecs, strClasses } from './enums';

@Entity()
export class CharacterItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slot: CharacterItemSlot;

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

    @Expose({ name: 'missing_enchantment' })
    get missingEnchantment(): boolean
    {
        if (this.slot)
        {
            // ['MAIN_HAND', 'OFF_HAND', 'BACK', 'CHEST', 'HANDS', 'FINGER_1', 'FINGER_2']
            // Mandatory enchantment
            if ([CharacterItemSlot.BACK, CharacterItemSlot.CHEST, CharacterItemSlot.FINGER_1, CharacterItemSlot.FINGER_2].indexOf(this.slot) >= 0)
                return !this.enchantments;

            // Check if this is a weapon not an holdable off hand
            if ([CharacterItemSlot.MAIN_HAND, CharacterItemSlot.OFF_HAND].indexOf(this.slot) >= 0 && this.item && this.item.slot != ItemSlot.HOLDABLE)
                return !this.enchantments;

            if ([CharacterItemSlot.WRIST, CharacterItemSlot.HANDS, CharacterItemSlot.FEET].indexOf(this.slot) >= 0 && this.character)
            {
                // If is an intel class or intel spec
                if (this.slot == CharacterItemSlot.WRIST && (intellClasses.indexOf(this.character.class) >= 0 || intellSpecs.indexOf(this.character.spec) >= 0) )
                    return !this.enchantments;
                if (this.slot == CharacterItemSlot.FEET && (agiClasses.indexOf(this.character.class) >= 0 || agiSpecs.indexOf(this.character.spec) >= 0))
                    return !this.enchantments;
                if (this.slot == CharacterItemSlot.HANDS && (strClasses.indexOf(this.character.class) >= 0))
                    return !this.enchantments;
            }
        }
        return false;
    }

    @Expose({ name: 'missing_socket' })
    get missingSocket(): boolean
    {
        if (!this.sockets)
            return false;

        return this.sockets && !this.sockets.every(socket => socket != '0')
    }

    @Index()
    @ManyToOne(type => Item, item => item.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item' })
    item: Item;

    @Exclude()
    @Index()
    @ManyToOne(type => Character, character => character.id, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'character' })
    character: Character;
    
    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}