import { Controller, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { CompositionsService } from './compositions.service';

@Controller('compositions')
export class CompositionsController {
    constructor(
        private readonly compositionsService: CompositionsService
    ) {}
}
