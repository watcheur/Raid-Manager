import { Exclude, Expose } from 'class-transformer';
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

@Unique('idx_members_complete', [ 'completed', 'duration', 'zone', 'period', 'character', 'level' ])
@Entity()
export class Weekly {
    @PrimaryColumn()
    level: number;

    @PrimaryColumn()
    zone: number;

    @PrimaryColumn()
    duration: number;

    @Column()
    timed: boolean;

    @PrimaryColumn()
    completed: Date;

    @Column({ type: 'simple-array' })
    affixes: DungeonAffixe[];

    @Column({ type: 'simple-array' })
    members: string[];

    @ManyToOne(type => Period, period => period.id, { cascade: true, onDelete: 'CASCADE', primary: true })
	@JoinColumn({ name: 'period' })
    period: Period;

    @Exclude()
    @PrimaryColumn({ name: 'period' })
    periodId: number;

    @ManyToOne(type => Character, character => character.id, { cascade: true, onDelete: "CASCADE", primary: true })
	@JoinColumn({ name: 'character' })
    character: Character;

    @Exclude()
    @PrimaryColumn({ name: 'character' })
    characterId: number;
}