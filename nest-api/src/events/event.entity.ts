import { Composition } from "src/compositions/composition.entity";
import { Raid, RaidDifficulty } from "src/raids/raid.entity";
import { Team } from "src/teams/team.entity";
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
    @ManyToOne(type => Raid, raid => raid.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'raid' })
    raid: Raid;

    @Index()
    @ManyToOne(type => Team, team => team.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team' })
    team: Team;

    @OneToMany(type => Composition, composition => composition.event)
    compositions: Composition[];

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}