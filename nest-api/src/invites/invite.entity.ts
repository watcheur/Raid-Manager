import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
    ManyToMany,
	JoinTable,
    CreateDateColumn,
	UpdateDateColumn, ManyToOne, OneToOne, Index
} from 'typeorm';

import { Team } from 'src/teams/team.entity';
import { User } from 'src/users/user.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

import * as moment from 'moment';

@Entity()
export class Invite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    expire: Date;

    @Index({ unique: true })
    @Column()
    hash: string;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    
    @ManyToOne(type => Team, team => team.invites)
    team: Team;

    @ManyToOne(type => User, user => user.invites)
    owner: User;
}