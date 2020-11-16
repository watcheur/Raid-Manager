import { Period } from 'src/periods/period.entity';
import {
	Entity,
	Column,
	OneToMany,
    Index,
    PrimaryColumn
} from 'typeorm';

@Entity()
export class Season {
    @PrimaryColumn({ generated: false })
    id: number;

    @Column()
    start: Date;

    @Column({ nullable: true })
    end: Date;

    @OneToMany(type => Period, period => period.season)
    periods: Period[];

    get current(): boolean
    {
        return !this.end && this.start <= new Date();
    }
}