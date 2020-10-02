import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Expansion } from './expansion.entity';
import { ExpansionsController } from './expansions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Expansion])],
    controllers: [ExpansionsController],
    providers: [ExpansionsService],
    exports: [ExpansionsService]
})
export class ExpansionsService {
    constructor(
        @InjectRepository(Expansion)
        private readonly expansionsRepository: Repository<Expansion>
    ){}

    public async findAll() : Promise<Expansion[]> {
        return this.expansionsRepository.find({
            relations: [ 'raids' ],
            order: {
                id: 'DESC'
            }
        })
    }

    public async findById(id: number) : Promise<Expansion | null> {
        return this.expansionsRepository.findOne({
            relations: [ 'raids' ],
            where: {
                id: id
            }
        });
    }

    public async create(expansion: Expansion) : Promise<Expansion> {
        return await this.expansionsRepository.save(expansion);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.expansionsRepository.delete(id);
    }
}
