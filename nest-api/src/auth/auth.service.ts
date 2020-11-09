import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/user.entity';
import { UserRO } from 'src/users/users.ro';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';
import { CreateUserDto } from 'src/users/users.dto';
import { ConfigService } from '@nestjs/config';
import { IToken } from './interfaces/token.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}
    
    private readonly logger = new Logger(AuthService.name);
    
    async register(user: CreateUserDto) {
        let status: RegistrationStatus = {
            success: true,
            message: 'user register',
        };
        try {
            await this.usersService.register(user);
        } catch (err) {
            //debug(err);
            status = { success: false, message: err };
        }
        return status;
    }

    createToken(user: User) : IToken {
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name
            },
            this.configService.get('JWT_SECRET'),
            { expiresIn: +this.configService.get<number>('JWT_EXPIRATION_TIME') },
        );
        
        return {
            expiresIn: +this.configService.get<number>('JWT_EXPIRATION_TIME'),
            token
        };
    }

    createRefreshToken(user: User) : IToken {
        const token = jwt.sign({
            id: user.id,
            name: user.name,
        }, this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        { expiresIn: +this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') })

        return {
            expiresIn: +this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
            token
        }
    }
    
    async validateUserToken(payload: JwtPayload): Promise<User | null> {
        return await this.usersService.findById(payload.id);
    }

    async validateUserRefreshToken(token: string, payload: JwtPayload): Promise<User | null> {
        return await this.usersService.findByRefreshTokenAndId(token, payload.id);
    }

    async validateUser(email: string, password: string): Promise<UserRO> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.comparePassword(password)) {
            this.logger.log('password check success');
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}