import { Season } from 'src/seasons/season.entity';
import { Weekly } from 'src/weeklys/weekly.entity';
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

@Entity()
export class Period {
    @PrimaryColumn()
    id: number;

    @Column()
    start: Date;

    @Column()
	end: Date;
	
    @Index()
    @ManyToOne(type => Season, season => season.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'season' })
	season?: Season;
}