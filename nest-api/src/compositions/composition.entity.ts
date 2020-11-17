import { Note } from "src/notes/note.entity";
import { Event } from "src/events/event.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Encounter } from "src/encounters/encounter.entity";
import { CharacterComp } from "./character-comp.entity";

@Entity()
export class Composition
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Event, event => event.compositions)
    @JoinColumn({ name: 'event' })
    event: Event | number;

    @ManyToOne(type => Encounter)
    @JoinColumn({ name: 'encounter' })
    encounter: Encounter | number;

    @OneToOne(type => Note)
    @JoinColumn({ name: 'note' })
    note: Note | number;

    @OneToMany(type => CharacterComp, charcomp => charcomp.composition)
    characters: CharacterComp[];

    @CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}