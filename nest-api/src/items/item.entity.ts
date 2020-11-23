import { Encounter } from 'src/encounters/encounter.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	OneToMany,
	ManyToMany,
	JoinTable, Index, PrimaryColumn, ManyToOne, JoinColumn
} from 'typeorm';

export enum ItemQuality {
    COMMON = "COMMON",
    UNCOMMON = "UNCOMMON",
    RARE = "RARE",
    EPIC = "EPIC",
    LEGENDARY = "LEGENDARY",
    ARTIFACT = "ARTIFACT",
    HEIRLOOM = "HEIRLOOM"
}

// See https://wow.gamepedia.com/API_C_Item.GetItemInventoryType
export enum ItemSlot {
    HEAD = "HEAD",
    NECK = "NECK",
    SHOULDER = "SHOULDER",
    CLOAK = "CLOAK",
    CHEST = "CHEST",
    SHIRT = "SHIRT",
    BODY = "BODY", // Should be same as shirt
    TABARD = "TABARD",
    WRIST = "WRIST",
    HAND = "HAND",
    WAIST = "WAIST",
    LEGS = "LEGS",
    FEET = "FEET",
    FINGER = "FINGER",
    TRINKET = "TRINKET",
    WEAPON = "WEAPON",
    SHIELD = "SHIELD",
    RANGED = "RANGED", // Bows
    TWOHANDWEAPON = "2HWEAPON",
    TWOHWEAPON = "TWOHWEAPON",
    BAG = "BAG", // Containers
    ROBE = "ROBE",
    WEAPONMAINHAND = "WEAPONMAINHAND",
    WEAPONOFFHAND = "WEAPONOFFHAND",
    HOLDABLE = "HOLDABLE",
    AMMO = "AMMO",
    THROWN = "THROWN",
    RANGEDRIGHT = "RANGEDRIGHT", // Wands, Guns, Crossbows
    QUIVER = "QUIVER",
    RELIC = "RELIC",
    NON_EQUIP = "NON_EQUIP"
}

@Entity()
export class Item {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @Index()
    @Column({
        type: "enum",
        enum: ItemSlot,
        nullable: true
    })
    slot?: string;

    @Index()
    @Column({
        type: "enum",
        enum: ItemQuality,
        nullable: true,
    })
    quality?: ItemQuality;

    @Index()
    @Column({ nullable: true })
    level?: number;

    @Column({ nullable: true })
    media?: string;

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @Index()
    @ManyToOne(type => Encounter, encounter => encounter.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'source' })
    source?: Encounter;
}