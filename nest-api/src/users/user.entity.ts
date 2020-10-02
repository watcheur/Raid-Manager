import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	OneToMany,
	ManyToMany,
	JoinTable, Index
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRO } from './users.ro';

import { Invite } from 'src/invites/invite.entity';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Team } from 'src/teams/team.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	@Index()
	name: string;
	
	@Exclude()
	@IsEmail()
	@Index({ unique: true })
	@Column()
	email: string;
	
	@Exclude()
	@Column()
	password: string;

	@OneToMany(type => Invite, invite => invite.owner)
	invites: Invite[];

	@ManyToMany(type => Team, team => team.users)
	teams: Team[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}
	
	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}
	
	async comparePassword(attempt: string): Promise<boolean> {
		return await bcrypt.compare(attempt, this.password);
	}
	
	toResponseObject(showToken: boolean = true): UserRO {
		const { id, name, email } = this;
		const responseObject: UserRO = {
			id,
			name,
			email,
		};
		
		return responseObject;
	}
}
