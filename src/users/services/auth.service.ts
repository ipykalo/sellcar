import { User } from './../user.entity';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './users.service';
import * as bcrypt from "bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class AuthService extends UserService {

  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  async signup(email: string, password: string): Promise<User> {
    try {
      const listOfUsers = await this.find(email);
      if (listOfUsers?.length) {
        throw new BadRequestException('A user with the email already exists.');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      return this.create(email, hashedPassword);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signin(email: string, password: string): Promise<User> {
    try {
      const [user] = await this.find(email);
      if (!user) {
        throw new NotFoundException('A user with the email does not exist.');
      }
      const isPasswordMatch: boolean = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Entered pasword is incorect.');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
