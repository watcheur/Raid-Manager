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
    HttpException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/users.dto';
import { LoginUserDto } from './login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}
        
    @ApiOperation({ summary: 'Register user' })
    @Post('register')
    public async register(@Body() createUserDto: CreateUserDto) {
        const result = await this.authService.register(createUserDto);
        if (!result.success)
            throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        return result;
    }
    
    @UseGuards(AuthGuard('local'))
    @ApiOperation({ summary: 'Login user and return jwt token' })
    @Post('login')
    public async login(@Body() login: LoginUserDto) {
        const user = await this.usersService.findByEmail(login.email);
        if (!user) {
            throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
        }
        else {
            if (!await user.comparePassword(login.password))
                throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
            
            return this.authService.createToken(user);
        }
    }
}