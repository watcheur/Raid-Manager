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
	@JoinTable()
	users: User[];

	@OneToMany(type => Player, player => player.team)
	@JoinTable()
	players: Player[];
	
	@OneToMany(type => Invite, invite => invite.team)
	invites: Invite[];
}
