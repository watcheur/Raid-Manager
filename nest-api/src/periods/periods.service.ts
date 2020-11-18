import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { Period } from './period.entity';

@Injectable()
export class PeriodsService {
    constructor(
        @InjectRepository(Period)
        private readonly periodsReposity: Repository<Period>
    ) {}

    public async findAll(): Promise<Period[]>
    {
        return await this.periodsReposity.find();
    }

    public async findById(id: number): Promise<Period | null>
    {
        return await this.periodsReposity.findOne(id);
    }

    public async findCurrent() : Promise<Period | null>
    {
        return await this.periodsReposity.findOne({
            where: {
                start: MoreThanOrEqual(new Date()),
                end: LessThanOrEqual(new Date())
            }
        })
    }

    public async save(period: Period): Promise<Period>
    {
        return await this.periodsReposity.save(period);
    }

    public async saveBatch(periods: Period[]): Promise<Period[]>
    {
        return await this.periodsReposity.save(periods);
    }

    public async update(id: number, newValue: Period): Promise<Period | null>
    {
        const period = await this.periodsReposity.findOneOrFail(id);
        if (!period.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.periodsReposity.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.periodsReposity.delete(id);
        return res.affected > 0;
    }
}
