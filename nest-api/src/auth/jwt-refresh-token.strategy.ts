import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { use } from 'passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                console.log("req", request?.cookies);
                console.log("req ?", request?.cookies?.Refresh)
                return request?.cookies?.Refresh;
            }]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
        });
    }
    
    async validate(request: Request, payload: JwtPayload): Promise<User | null> {
        const user = await this.authService.validateUserRefreshToken(request.cookies?.Refresh, payload);
        if (!user)
           throw new UnauthorizedException()
        return user;
    }
}
