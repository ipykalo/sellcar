import { User } from '../user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  update(id: number, dataToUpdate: Partial<User>): Promise<User> {
    return this.findOne(id)
      .then(user => {
        if (!user) {
          throw new NotFoundException('A user not found.');
        }
        return this.repo.save({ ...user, ...dataToUpdate });
      });
  }

  remove(id: number): Promise<User> {
    return this.repo.findOne(id)
      .then(user => {
        if (!user) {
          throw new NotFoundException('A user not found.');
        }
        return this.repo.remove(user);
      });
  }

  findOne(id: number): Promise<User> {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ email });
  }
}
