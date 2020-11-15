import { Exclude } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { Player } from 'src/players/player.entity';
import { Realm } from 'src/realms/realm.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	OneToMany,
	ManyToMany,
	JoinTable, Index, PrimaryColumn, ManyToOne
} from 'typeorm';

@Entity()
export class Period {
    @PrimaryColumn({ generated: false })
    id: number;

    @Column()
    start: Date;

    @Column()
    end: Date;
}