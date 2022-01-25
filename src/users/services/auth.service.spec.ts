import { User } from './../user.entity';
import { UserService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    const mockedUser = { id: 1, email: 'test@gmail.com', password: '12345'};

    it('should throw an error if email already exists', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);
      
      authService.signup(mockedUser.email, mockedUser.password)
        .then()
        .catch(err => {
          expect(err.response.message).toEqual('A user with the email already exists.');
        });
    });

    it('should create a user', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([] as User[]);
      const bcryptHash = jest.fn().mockResolvedValue('hashed-pasword');
      (bcrypt.hash as jest.Mock) = bcryptHash;
      jest.spyOn(UserService.prototype, 'create').mockResolvedValue(mockedUser as User);

      authService.signup(mockedUser.email, mockedUser.password)
        .then(user => {
          expect(user.email).toEqual(mockedUser.email);
        });
    });
  });
});
