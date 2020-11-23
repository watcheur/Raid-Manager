import { Raid } from 'src/raids/raid.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index
} from 'typeorm';

@Entity()
export class Expansion {
    constructor() {}

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @OneToMany(type => Raid, raid => raid.expansion, { cascade: true, onDelete: "CASCADE" })
    raids: Raid[];
}
