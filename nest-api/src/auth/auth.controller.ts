import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Request,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    HttpException,
    Res,
    HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/users.dto';
import { LoginUserDto } from './login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClearCookies, Cookies, SetCookies } from '@nestjsplus/cookies';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { LocalAuthenticationGuard } from './local-authentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}
        
    @ApiOperation({ summary: 'Register user' })
    @Post('register')
    public async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.findByEmail(createUserDto.email);
        if (user)
            throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);

        const result = await this.authService.register(createUserDto);
        if (!result.success)
            throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        return result;
    }
    
    @HttpCode(200)
    @SetCookies()
    @UseGuards(LocalAuthenticationGuard)
    @ApiOperation({ summary: 'Login user and return jwt token' })
    @Post('login')
    public async login(@Body() login: LoginUserDto, @Request() req) {
        const user = await this.usersService.findByEmail(login.email);
        if (!user) {
            throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
        }
        else {
            if (!await user.comparePassword(login.password))
                throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
            
            const accessToken = this.authService.createToken(user);
            const refreshToken = this.authService.createRefreshToken(user);
            
            await this.usersService.setRefreshToken(refreshToken.token, user.id);

            req._cookies = [
                {
                    name: 'Authentication',
                    value: accessToken.token,
                    options: {
                        maxAge: accessToken.expiresIn * 1000,
                        httpOnly: true,
                    }
                },
                {
                    name: 'Refresh',
                    value: refreshToken.token,
                    options: {
                        maxAge: refreshToken.expiresIn * 1000,
                        httpOnly: true
                    }
                }
            ];

            return plainToClass(User, user);
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Logout user and remove jwt token from cookies' })
    @HttpCode(200)
    @SetCookies()
    @Get('logout')
    public async logout(@Request() req) {
        const { user } = req;
        await this.usersService.removeRefreshToken(user.id);
        req._cookies = [
            {
                name: 'Authentication',
                value: '',
                options: {
                    maxAge: 0,
                    httpOnly: true,
                }
            },
            {
                name: 'Refresh',
                value: '',
                options: {
                    maxAge: 0,
                    httpOnly: true
                }
            }
        ]
        return true;
    }

    @SetCookies()
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    public async refresh(@Request() req) {
        const accessToken = this.authService.createToken(req.user);

        req._cookies = [
            {
                name: 'Authentication',
                value: accessToken.token,
                options: {
                    maxAge: accessToken.expiresIn * 1000,
                    httpOnly: true,
                }
            }
        ];

        return plainToClass(User, req.user);
    }
}