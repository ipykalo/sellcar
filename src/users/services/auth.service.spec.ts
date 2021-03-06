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
  const password = '12345';

  beforeEach(async () => {
    const hashPassword = await bcrypt.hash(password, 10);
    mockedUser = { id: 1, email: 'test@gmail.com', password: hashPassword };
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup()', () => {

    it('should throw an error if email already exists', (done) => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);

      authService.signup(mockedUser.email, password)
        .catch(err => {
          expect(err.response.message).toEqual('A user with the email already exists.');
          done();
        });
    });

    it('should create a user', (done) => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([] as User[]);
      jest.spyOn(UserService.prototype, 'create').mockResolvedValue(mockedUser as User);

      authService.signup(mockedUser.email, password)
        .then(user => {
          expect(user.email).toEqual(mockedUser.email);
          done();
        });
    });
  });

  describe('signin()', () => {

    it('should throw error if user doesn\'t exist', (done) => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([] as User[]);

      authService.signin(mockedUser.email, password)
        .catch(err => {
          expect(err.response.message).toEqual('A user with the email does not exist.');
          done();
        });
    });

    it('should throw error if password doesn\'t match', (done) => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);
      authService.signin(mockedUser.email, '123456')
        .catch(err => {
          expect(err.response.message).toEqual('Entered pasword is incorect.');
          done();
        });
    });

    it('should login a user', (done) => {
      jest.spyOn(UserService.prototype, 'find').mockResolvedValue([mockedUser] as User[]);
      authService.signin(mockedUser.email, password)
        .then(user => {
          expect(user.password).toEqual(mockedUser.password);
          done();
        });
    });
  });
});
