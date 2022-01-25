import { CurrentUser } from './decorators/current-user.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, NotFoundException, HttpCode, Session, UseGuards } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UserDto } from './dtos/user.dto';
import { AuthUserDto } from './dtos/auth-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from './services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

  constructor(private userService: UserService, private authService: AuthService) { }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  getLoginUser(@CurrentUser() user: User): UserDto {
    return user;
  }

  @Post('/signup')
  createUser(@Body() body: AuthUserDto): Promise<User> {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  @HttpCode(200)
  signin(@Body() body: AuthUserDto, @Session() session): Promise<User> {
    return this.authService.signin(body.email, body.password)
      .then((user: User) => {
        session.userId = user.id;
        return user;
      });
  }

  @Post('/logout')
  @HttpCode(200)
  logout(@Session() session): string {
    session.userId = null;
    return 'The user logged out.'
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  fetchAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.userService.find(email);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: string): Promise<User> {
    return this.userService.remove(parseInt(id));
  }
}
