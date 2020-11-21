import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
    providers: [
        UsersService,
        AppGateway
    ],
    exports: [UsersService]
})
export class UsersModule {}
