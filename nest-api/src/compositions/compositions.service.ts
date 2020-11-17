import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    public async findByEvent(event: number): Promise<Composition | null>
    {
        return await this.compositionsRepository.findOne({
            relations: [ "encounter", "note", "characters" ],
            where: {
                event: event
            }
        })
    }

    public async create(composition: CompositionDto): Promise<Composition>
    {
        return await this.compositionsRepository.save(composition);
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
