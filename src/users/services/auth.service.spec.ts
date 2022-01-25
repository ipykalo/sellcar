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

  let mockedUser: Partial<User>;

  beforeEach(async () => {
    const hashPassword = await bcrypt.hash('12345', 10);
    mockedUser = { id: 1, email: 'test@gmail.com', password: hashPassword };
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup()', () => {

    it('should throw an error if email already exists', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);

      authService.signup(mockedUser.email, mockedUser.password)
        .catch(err => {
          expect(err.response.message).toEqual('A user with the email already exists.');
        });
    });

    it('should create a user', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([] as User[]);
      jest.spyOn(UserService.prototype, 'create').mockResolvedValue(mockedUser as User);

      authService.signup(mockedUser.email, mockedUser.password)
        .then(user => {
          expect(user.email).toEqual(mockedUser.email);
        });
    });
  });

  describe('signin()', () => {

    it('should throw error if user doesn\'t exist', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([] as User[]);

      authService.signin(mockedUser.email, mockedUser.password)
        .catch(err => {
          expect(err.response.message).toEqual('A user with the email does not exist.');
        });
    });

    it('should throw error if password doesn\'t match', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);
      authService.signin(mockedUser.email, '123456')
        .catch(err => {
          expect(err.response.message).toEqual('Entered pasword is incorect.');
        });
    });

    it('should login a user', () => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);
      authService.signin(mockedUser.email, '12345')
        .then(user => {
          expect(user.password).toEqual(mockedUser.password);
        })
        .catch(err => expect(err).toBeFalsy());
    });
  });
});
