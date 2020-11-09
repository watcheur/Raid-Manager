import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return all realms' })
    @Get()
    async getAll(): Promise<User[]> {
        return plainToClass(User, await this.usersService.findAll());
    }

    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Return current user' })
    @Get('current')
    async findOne(@Request() req): Promise<User> {
        return plainToClass(User, req.user);
    }
}