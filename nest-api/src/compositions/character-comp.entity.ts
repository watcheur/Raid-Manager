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

    @ManyToOne(type => Character, character => character.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'character' })
    character: Character;

    @Index()
    @Column({ name: 'character' })
    characterId: number;

    @ManyToOne(type => Composition, composition => composition.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'composition' })
    composition: Composition;

    @Index()
    @Column({ name: 'composition' })
    compositionId: number;
}