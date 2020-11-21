import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weekly } from './weekly.entity';

@Injectable()
export class WeeklysService {
    constructor(
        @InjectRepository(Weekly)
        private readonly weeklysRepository: Repository<Weekly>
    ) {}

    public async findAll(): Promise<Weekly[]>
    {
        return await this.weeklysRepository.find();
    }

    public async findById(id: number): Promise<Weekly | null>
    {
        return await this.weeklysRepository.findOne(id);
    }

    public async findByCharacter(characterId: number): Promise<Weekly[]>
    {
        return await this.weeklysRepository.find({
            where: {
                character: characterId
            }
        })
    }

    public async save(weekly: Weekly): Promise<Weekly>
    {
        return await this.weeklysRepository.save(weekly);
    }

    public async saveRaw(weekly: any): Promise<Weekly>
    {
        return await this.weeklysRepository.save(weekly);
    }

    public async saveBatch(weeklys: any[]): Promise<Weekly[]>
    {
        return await this.weeklysRepository.save(weeklys);
    }

    public async update(id: number, newValue: Weekly): Promise<Weekly>
    {
        const weekly = await this.weeklysRepository.findOneOrFail(id);
        if (!weekly) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.weeklysRepository.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.weeklysRepository.delete(id);
        return res.affected > 0;
    }
}
