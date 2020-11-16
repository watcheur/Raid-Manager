import { Encounter } from 'src/encounters/encounter.entity';
import { Expansion } from 'src/expansions/expansion.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index, PrimaryColumn, ManyToOne, JoinColumn
} from 'typeorm';

export enum RaidDifficulty
{
    LFR = 'LFR',
    NORMAL = 'NORMAL',
    HEROIC = 'HEROIC',
    MYTHIC = 'MYTHIC'
}

@Entity()
export class Raid {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @Column()
    minimumLevel: number;

    @ManyToOne(type => Expansion, exp => exp.id)
    @JoinColumn({ name: 'expansion' })
    expansion: Expansion;

    @OneToMany(type => Encounter, encounter => encounter.raid, { cascade: true, onDelete: "CASCADE" })
    @JoinTable()
    encounters: Encounter[];
}
