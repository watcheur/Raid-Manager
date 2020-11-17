import { Character, Role } from "src/characters/character.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Composition } from "./composition.entity";

@Entity()
export class CharacterComp
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: Role;

    @Index()
    @ManyToOne(type => Character)
    @JoinColumn({ name: 'character' })
    character: Character | number;

    @Index()
    @ManyToOne(type => Composition, composition => composition.characters)
    @JoinColumn({ name: 'composition' })
    composition: Composition | number;
}