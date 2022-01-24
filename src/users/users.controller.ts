import { Body, Controller, Delete, Get, Param, Patch, Post, Query, NotFoundException, HttpCode } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UserDto } from './dtos/user.dto';
import { AuthUserDto } from './dtos/auth-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './services/auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

  constructor(private userService: UserService, private authService: AuthService) { }

  @Post('/signup')
  createUser(@Body() body: AuthUserDto): Promise<User> {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  @HttpCode(200)
  signin(@Body() body: AuthUserDto): Promise<User> {
    return this.authService.signin(body.email, body.password);
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
