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
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
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
        
    @Post('register')
    public async register(@Response() res, @Body() createUserDto: CreateUserDto) {
        const result = await this.authService.register(createUserDto);
        if (!result.success) {
            return res.status(HttpStatus.BAD_REQUEST).json(result);
        }
        return res.status(HttpStatus.OK).json(result);
    }
    
    @UseGuards(AuthGuard('local'))
    @Post('login')
    public async login(@Response() res, @Body() login: LoginUserDto) {
        const user = await this.usersService.findByEmail(login.email);
        if (!user) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'User Not Found',
            });
        } else {
            if (!await user.comparePassword(login.password))
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Login failed'
                });
            
            const token = this.authService.createToken(user);
            return res.status(HttpStatus.OK).json(token);
        }
    }
}