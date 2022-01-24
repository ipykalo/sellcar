import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService, AuthService],
  controllers: [UsersController]
})
export class UsersModule { }
