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

    @ManyToOne(type => Event, event => event.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event' })
    event: Event;

    @Index()
    @Column({ name: 'event' })
    eventId: number;

    @ManyToOne(type => Encounter, encounter => encounter.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'encounter' })
    encounter: Encounter;

    @Index()
    @Column({ name: 'encounter' })
    encounterId: number;

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