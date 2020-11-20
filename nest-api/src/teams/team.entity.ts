import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
    ManyToMany,
	JoinTable,
    CreateDateColumn,
	UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn
} from 'typeorm';

import { User } from 'src/users/user.entity';
import { Invite } from 'src/invites/invite.entity';
import { Player } from 'src/players/player.entity';
import { Exclude, Transform } from 'class-transformer';
import { Character } from 'src/characters/character.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
	name: string;
	
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@Exclude()
	@ManyToOne(type => User)
	@Transform(user => user.id)
	@JoinColumn({ name: 'founder' })
	founder: User;

	@Exclude()
	@ManyToMany(type => User, user => user.teams, {
		cascade: true
	})
	@JoinTable({
		name: 'team_users',
		joinColumn: {
			name: 'team',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		}
	})
	users: User[];

	@Exclude()
	@OneToMany(type => Player, player => player.team)
	players: Player[];

	@Exclude()
	@ManyToMany(type => Character)
	@JoinTable({
		name: 'team_characters',
		joinColumn: {
			name: 'team',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'character',
			referencedColumnName: 'id'
		}
	})
	characters: Character[];
	
	@Exclude()
	@OneToMany(type => Invite, invite => invite.team)
	invites: Invite[];
}

@Entity('team_characters')
export class TeamCharater {
	@Column()
	@IsNotEmpty()
	@PrimaryColumn()
	team: number;

	@Column()
	@IsNotEmpty()
	@PrimaryColumn()
	character: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date
}