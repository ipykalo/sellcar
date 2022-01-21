import { UserService } from './users.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Controller('auth')
export class UsersController {

  constructor(private userService: UserService) { }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body.email, body.password);
  }

  @Get('/:id')
  fetchOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }
}
