import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Like, DeepPartial } from 'typeorm';
import { Realm } from './realm.entity';
import { RealmDto } from './realms.dto';

@Injectable()
export class RealmsService {
    constructor(
        @InjectRepository(Realm)
        private readonly realmRepository: Repository<Realm>
    ){}

    public async findAll(): Promise<Realm[]> {
        return await this.realmRepository.find();
    }

    public async findByName(name: string) : Promise<Realm | null> {
        return await this.realmRepository.findOne({ name: Like(name) });
    }

    public async findById(id: number) : Promise<Realm | null> {
        return await this.realmRepository.findOne(id);
    }

    public async save(realm: RealmDto): Promise<RealmDto> {
        return await this.realmRepository.save(realm);
    }

    public async saveBatch(realms: RealmDto[]): Promise<RealmDto[]> {
        return await this.realmRepository.save(realms);
    }

    public async update(
        id: number,
        newValue: RealmDto
    ) : Promise<Realm | null> {
        const realm = await this.realmRepository.findOneOrFail(id);
        if (!realm.id) {
            // tslint:disable-next-line:no-console
            console.error("Realm doesn't exist");
        }

        await this.realmRepository.update(id, newValue);
        return await this.realmRepository.findOneOrFail(id);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.realmRepository.delete(id);
    }
}
