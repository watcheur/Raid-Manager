import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteDto } from './note.dto';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private readonly notesRepository: Repository<Note>
    ) {}

    public async findAll(favorite: boolean): Promise<Note[]>
    {
        return await this.notesRepository.find({
            where: {
                favorite: favorite
            }
        });
    }

    public async findById(id: number): Promise<Note | null>
    {
        return await this.notesRepository.findOne(id);
    }

    public async create(note: NoteDto): Promise<Note>
    {
        return await this.notesRepository.create(note);
    }

    public async update(id: number, newValue: NoteDto): Promise<Note>
    {
        const note = await this.notesRepository.findOneOrFail(id);
        if (!note.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.notesRepository.update(id, newValue);
        return this.findById(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.notesRepository.delete(id);
        return res.affected > 0;
    }
}
