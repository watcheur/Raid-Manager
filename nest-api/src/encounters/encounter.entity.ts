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

import { Item } from 'src/items/item.entity';
import { Raid } from 'src/raids/raid.entity';

@Entity()
export class Encounter {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 0 })
    order?: number;

    @Index()
    @ManyToOne(type => Raid, raid => raid.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'raid' })
    raid?: Raid;

    @OneToMany(type => Item, item => item.source, { cascade: true, onDelete: "CASCADE" })
    @JoinTable()
    items?: Item[];
}