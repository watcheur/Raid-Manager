import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionDto } from './option.dto';
import { Option } from './option.entity';

@Injectable()
export class OptionsService {
    constructor(
        @InjectRepository(Option)
        private readonly optionsRepository: Repository<Option>
    ) {}
    
    public async findAll(teamId: number): Promise<Option[]>
    {
        return await this.optionsRepository.find({
            where: {
                team: teamId
            }
        })
    }

    public async findById(id: number): Promise<Option | null>
    {
        return await this.optionsRepository.findOne(id);
    }

    public async findByKey(key: string, teamId: number): Promise<Option | null>
    {
        return await this.optionsRepository.findOne({
            where: {
                team: {
                    id: teamId
                },
                key: key
            }
        })
    }

    public async save(teamId: number, option: OptionDto): Promise<Option>
    {
        return await this.optionsRepository.save({
            ...option,
            teamId: teamId
        });
    }
    
    public async update(id: number, newValue: OptionDto): Promise<Option>
    {
        const note = await this.optionsRepository.findOneOrFail(id);
        if (!note.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.optionsRepository.update(id, newValue);
        return this.findById(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.optionsRepository.delete(id);
        return res.affected > 0;
    }
}
