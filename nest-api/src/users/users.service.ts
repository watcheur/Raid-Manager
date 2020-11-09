import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    public async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async findByName(name: string) : Promise<User | null> {
        return await this.userRepository.findOne({ name: name });
    }

    public async findByEmail(email: string) : Promise<User | null> {
        return await this.userRepository.findOne({ email: email });
    }

    public async findById(id: number) : Promise<User | null> {
        return await this.userRepository.findOneOrFail(id);
    }

    public async findByRefreshTokenAndId(refreshToken: string, userId: number): Promise<User | null> {
        const user = await this.findById(userId);
        if (!user)
            return null;

        if (user.compareRefreshToken(refreshToken))
            return user;
        return null;
    }

    public async create(user: CreateUserDto): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async update(
        id: number,
        newValue: CreateUserDto
    ) : Promise<User | null> {
        const user = await this.userRepository.findOneOrFail(id);
        if (!user.id) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }

        await this.userRepository.update(id, newValue);
        return await this.userRepository.findOneOrFail(id);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    public async register(userDto: CreateUserDto): Promise<User> {
        const { email } = userDto;

        let user = await this.userRepository.findOne({ email: email });
        if (user) {
            throw new HttpException(
                'User already exists',
                HttpStatus.BAD_REQUEST
            )
        }

        user = await this.userRepository.create(userDto);
        return await this.userRepository.save(user);
    }

    public async setRefreshToken(token: string, userId: number) {
        const refreshToken = await bcrypt.hash(token, 10);
        await this.userRepository.update(userId, {
            refreshToken
        });
    }

    public async removeRefreshToken(userId: number) {
        return this.userRepository.update(userId, {
            refreshToken: null
        })
    }
}
