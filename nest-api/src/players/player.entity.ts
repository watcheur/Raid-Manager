import { IsNotEmpty } from 'class-validator';
import { Character } from 'src/characters/character.entity';
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
	JoinTable, Index, PrimaryColumn, ManyToOne, Unique, JoinColumn
} from 'typeorm';

export enum Rank {
	TBD = 0,
	Out,
	Apply,
	Raider
}

@Entity()
@Index("idx_name_team", [ "name", "team" ], { unique: true })
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

	@Index()
    @Column()
	name: string;
	
	@Index()
	@Column({ type: "enum", enum: Rank })
	rank: Rank;

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @Index()
    @ManyToOne(type => Team, team => team.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'team' })
	team: Team;
	
	@ManyToMany(type => Character, character => character.players)
	@JoinTable({
		name: 'player_characters',
		joinColumn: {
			name: 'player',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'character',
			referencedColumnName: 'id'
		}
	})
	characters: Character[];
}

@Entity('player_characters')
export class PlayerCharacter {
	@Column()
	@IsNotEmpty()
	@PrimaryColumn()
	player: number;

	@Column()
	@IsNotEmpty()
	@PrimaryColumn()
	character: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date
}