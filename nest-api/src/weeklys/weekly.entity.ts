import { Character } from 'src/characters/character.entity';
import { Period } from 'src/periods/period.entity';

import {
	Entity,
	Column,
    OneToMany,
    Index,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

@Entity()
export class Weekly {
    @PrimaryColumn()
    id: number;

    @Column()
    level: number;

    @Column()
    zone: number;

    @Column()
    timed: boolean;

    @Column({ type: "timestamp" })
    timestamp: number;

    @Index()
    @ManyToOne(type => Period, period => period.id)
	@JoinColumn({ name: 'period' })
    period: Period;

    @Index()
    @ManyToOne(type => Character, character => character.id)
	@JoinColumn({ name: 'character' })
    character: Character;
}