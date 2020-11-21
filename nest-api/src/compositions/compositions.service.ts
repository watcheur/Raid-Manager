import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotesService } from 'src/notes/notes.service';
import { Repository } from 'typeorm';
import { CharacterComp } from './character-comp.entity';
import { CompositionDto } from './composition.dto';
import { Composition } from './composition.entity';

@Injectable()
export class CompositionsService {
    constructor(
        @InjectRepository(Composition)
        private readonly compositionsRepository: Repository<Composition>,
        
        @InjectRepository(CharacterComp)
        private readonly characterCompsRepository: Repository<CharacterComp>,

        private readonly notesService: NotesService
    ) {}

    public async findAll(): Promise<Composition[]>
    {
        return await this.compositionsRepository.find();
    }

    public async findById(id: number): Promise<Composition | null>
    {
        return await this.compositionsRepository.findOne({
            relations: [ "event", "encounter", "note", "characters" ],
            where: {
                id: id
            }
        })
    }

    public async findByEvent(event: number): Promise<Composition[] | null>
    {
        return await this.compositionsRepository.find({
            relations: [ "encounter", "note", "characters" ],
            where: {
                event: event
            }
        })
    }

    public async findByEventAndEncounter(event: number, encounter: number): Promise<Composition | null>
    {
        return await this.compositionsRepository.findOne({
            relations: [ "encounter", "note", "characters", "characters.character" ],
            where: {
                event: event,
                encounter: encounter
            }
        })
    }

    public async save(eventId: number, encounterId: number, composition: CompositionDto): Promise<Composition>
    {
        const comp = await this.compositionsRepository.save({
            eventId: eventId,
            encounterId: encounterId,
            note: composition.note,
            characters: composition.characters
        });

        /*
        if (composition.characters)
        {
            const ids = composition.characters.map(c => c.characterId);

        }
        */

        return this.findById(comp.id);
    }

    public async update(id: number, newValue: CompositionDto): Promise<Composition>
    {
        const composition = await this.compositionsRepository.findOneOrFail(id);
        if (!composition.id) {
            // tslint:disable-next-line:no-console
            console.error("composition doesn't exist");
        }

        await this.compositionsRepository.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.compositionsRepository.delete(id);
        return res.affected > 0;
    }
}
