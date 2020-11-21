import { Character } from 'src/characters/character.entity';
import { Period } from 'src/periods/period.entity';

import {
	Entity,
	Column,
    OneToMany,
    Index,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    PrimaryGeneratedColumn
} from 'typeorm';

export enum DungeonAffixe {
    Overflowing = 1,
    Skittish,
    Volcanic,
    Necrotic,
    Teeming,
    Raging,
    Bolstering,
    Sanguine,
    Tyrannical,
    Fortified,
    Bursting,
    Grievous,
    Explosive,
    Quaking,
    Infested = 16,
    Beguiling = 119,
    Awakened,
    Prideful,
    Inspiring,
    Spiteful,
    Storming,
}

@Unique('idx_members_complete', [ 'completed', 'duration', 'zone' ])
@Entity()
export class Weekly {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    level: number;

    @Column()
    zone: number;

    @Column()
    duration: number;

    @Column()
    timed: boolean;

    @Column()
    completed: Date;

    @Column({ type: 'simple-array' })
    affixes: DungeonAffixe[];

    @Column({ type: 'simple-array' })
    members: string[];

    @Index()
    @ManyToOne(type => Period, period => period.id, { cascade: true, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'period' })
    period: Period;

    @Index()
    @ManyToOne(type => Character, character => character.id, { cascade: true, onDelete: "CASCADE" })
	@JoinColumn({ name: 'character' })
    character: Character;
}