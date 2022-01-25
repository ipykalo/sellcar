import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './services/auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UserService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }],
  controllers: [UsersController]
})
export class UsersModule { }
