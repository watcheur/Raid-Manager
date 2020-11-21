import { Encounter } from 'src/encounters/encounter.entity';
import { Team } from 'src/teams/team.entity';
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
import { OptionDto } from './option.dto';

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    key: string;

    @Column()
    value: string;

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @ManyToOne(type => Team, team => team.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team' })
    team?: Team;

    @Index()
    @Column({ name: 'team' })
    teamId: number;
}