import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaidDifficulty } from 'src/raids/raid.entity';
import { Repository } from 'typeorm';
import { WishDto } from './whish.dto';
import { Wish } from './wish.entity';

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(Wish)
        private readonly wishsRepository: Repository<Wish>
    ){}

    public async findAll(): Promise<Wish[]>
    {
        return await this.wishsRepository.find();
    }

    public async findById(id: number): Promise<Wish | null>
    {
        return await this.wishsRepository.findOne({
            relations: [ "character", "item" ],
            where: {
                id: id
            }
        });
    }

    public async findByItem(item: number): Promise<Wish[] | null>
    {
        return await this.wishsRepository.find({
            relations: [ "character", "item" ],
            where: {
                item: item
            }
        })
    }

    public async findByCharacter(character: number): Promise<Wish[]>
    {
        return await this.wishsRepository.find({
            relations: [ "character", "item" ],
            where: {
                character: character
            }
        })
    }

    public async findByCharacterAndRaid(raid: number, character: number): Promise<Wish[]>
    {
        return await this.wishsRepository.find({
            relations: [ "item" ],
            where: {
                character: character,
                item: {
                    source: {
                        raid: raid
                    }
                }
            }
        })
    }

    /**
     * Perform a single request to the Blizzard API.
     * @param {Object} [args] API request parameters
     * @param {Number} [args.character] The character id
     * @param {Number} [args.raid] The raid id
     * @param {Number} [args.encounter] The encounter id
     * @param {RaidDifficulty} [args.difficulty] The difficulty
     * @return {Promise} A thenable Promises/A+ reference
    */
    public async findByParams(args): Promise<Wish[]>
    {
        const { character, raid, encounter, difficulty } = args;
        let where = {};

        if (character)
            where['character'] = character;
        if (difficulty)
            where['difficulty'] = difficulty;
        
        if (encounter)
            where['item'] = {
                source: {
                    id: encounter
                }
            }
        else if (raid)
        {
            where['item'] = {
                source: {
                    raid: raid
                }
            }
        }

        return await this.wishsRepository.find({
            relations: [ "item", "item.source" ],
            where: where
        })
    }

    public async create(wishDto: WishDto): Promise<Wish>
    {
        return await this.wishsRepository.save(wishDto);
    }

    public async update(id: number, newValue: WishDto): Promise<Wish | null>
    {
        const wish = await this.wishsRepository.findOneOrFail(id);
        if (!wish.id) {
            // tslint:disable-next-line:no-console
            console.error("wish doesn't exist");
        }

        await this.wishsRepository.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: number): Promise<boolean>
    {
        const res = await this.wishsRepository.delete(id);
        return res.affected > 0;
    }
}
