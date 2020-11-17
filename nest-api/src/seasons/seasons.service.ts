import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, Raw, Repository } from 'typeorm';
import { Season } from './season.entity';

@Injectable()
export class SeasonsService {
    constructor(
        @InjectRepository(Season)
        private readonly seasonsRepository: Repository<Season>
    ) {}

    public async findAll(): Promise<Season[]>
    {
        return await this.seasonsRepository.find();
    }

    public async findById(id: number): Promise<Season | null>
    {
        return await this.seasonsRepository.findOne({
            relations: [ 'periods' ],
            where: {
                id: id
            }
        })
    }

    public async getCurrent(): Promise<Season | null>
    {
        return await this.seasonsRepository.findOne({
            relations: [ 'periods' ],
            where: {
                start: LessThanOrEqual(new Date()),
                end: IsNull()
            }
        })
    }
}
