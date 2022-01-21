import { UserService } from './users.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {

  constructor(private userService: UserService) { }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body.email, body.password);
  }

  @Get('/:id')
  fetchUser(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(parseInt(id))
      .then(user => {
        if (user) {
          return user;
        }
        throw new NotFoundException('A user not found.')
      });
  }

  @Get()
  fetchAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.userService.remove(parseInt(id));
  }
}
