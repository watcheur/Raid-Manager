import { Season } from 'src/seasons/season.entity';
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
	
    @Index()
    @ManyToOne(type => Season, season => season.periods)
    season: Season;
}