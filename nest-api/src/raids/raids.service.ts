import { Module, Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Raid } from './raid.entity';
import { RaidsController } from './raids.controller';

@Injectable()
export class RaidsService {
    constructor(
        @InjectRepository(Raid)
        private readonly raidsRepository: Repository<Raid>
    ){}

    public async findAll() : Promise<Raid[]> {
        return this.raidsRepository.find({
            relations: [ 'encounters' ],
            order: {
                id: 'DESC'
            }
        })
    }

    public async findById(id: number) : Promise<Raid | null> {
        return this.raidsRepository.findOne({
            relations: [ 'encounters' ],
            where: {
                id: id
            }
        });
    }

    public async findByExpansion(expansion: number) : Promise<Raid[]> {
        return this.raidsRepository.find({
            relations: [ 'encounters' ],
            where: {
                expansion: expansion
            },
            order: {
                id: 'DESC'
            }
        })
    }

    public async save(raid: Raid) : Promise<Raid> {
        return await this.raidsRepository.save(raid);
    }

    public async saveBatch(raids: Raid[]) : Promise<Raid[]> {
        return await this.raidsRepository.save(raids);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.raidsRepository.delete(id);
    }
}
