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
    Index, PrimaryColumn, ManyToOne
} from 'typeorm';

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
    expansion: Expansion;

    @OneToMany(type => Encounter, encounter => encounter.raid)
    @JoinTable()
    encounters: Encounter[];
}
