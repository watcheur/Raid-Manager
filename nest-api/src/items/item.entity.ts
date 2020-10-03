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
	JoinTable, Index, PrimaryColumn, ManyToOne
} from 'typeorm';

@Entity()
export class Item {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @Index()
    @Column({ nullable: true })
    slot: string;

    @Index()
    @Column({ nullable: true })
    quality: string;

    @Index()
    @Column({ nullable: true })
    level: number;

    @Column({ nullable: true })
    media: string;

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @Index()
    @ManyToOne(type => Encounter, encounter => encounter.items)
    source: Encounter;
}