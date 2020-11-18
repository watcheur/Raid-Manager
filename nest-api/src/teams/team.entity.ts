import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
    ManyToMany,
	JoinTable,
    CreateDateColumn,
	UpdateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';

import { User } from 'src/users/user.entity';
import { Invite } from 'src/invites/invite.entity';
import { Player } from 'src/players/player.entity';
import { Transform } from 'class-transformer';
import { Character } from 'src/characters/character.entity';

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

	@ManyToOne(type => User)
	@Transform(user => user.id)
	@JoinColumn({ name: 'founder' })
	founder: User;

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

	@OneToMany(type => Player, player => player.team)
	players: Player[];

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
	
	@OneToMany(type => Invite, invite => invite.team)
	invites: Invite[];
}
