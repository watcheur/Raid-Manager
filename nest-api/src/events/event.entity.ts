import { Composition } from "src/compositions/composition.entity";
import { Raid, RaidDifficulty } from "src/raids/raid.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Event
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    schedule: Date;

    @Column()
    difficulty: RaidDifficulty;

    @Index()
    @ManyToOne(type => Raid)
    @JoinColumn({ name: 'raid' })
    raid: Raid;

    @OneToMany(type => Composition, composition => composition.event)
    compositions: Composition[];

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}