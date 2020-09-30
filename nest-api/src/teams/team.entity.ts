import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
    ManyToMany,
	JoinTable,
    CreateDateColumn,
	UpdateDateColumn, ManyToOne
} from 'typeorm';

import { User } from 'src/users/user.entity';
import { Invite } from 'src/invites/invite.entity';
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
	founder: User;

	@ManyToMany(type => User)
	@JoinTable()
	users: User[];
	
	@OneToMany(type => Invite, invite => invite.team)
	invites: Invite[];
}
