import { User } from './user.entity';
import { UserService } from './services/users.service';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './services/auth.service'; import { doesNotMatch } from 'assert';
;

const mockedUser = {
  id: 1,
  email: 'test@gmail.com',
  password: '12345'
}

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: mockedUser.email, password: mockedUser.password } as User);
      },
      find: (email: string) => Promise.resolve([mockedUser] as User[]),
      update: (id: number, dataToUpdate: Partial<User>) => {
        return Promise.resolve({ id, email: mockedUser.email, password: mockedUser.password } as User);
      },
      remove: (id: number) => {
        return Promise.resolve({ id, email: mockedUser.email, password: mockedUser.password } as User);
      }
    };
    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAllUsers()', () => {
    it('should fetch all users with a given email', async () => {
      try {
        const list = await controller.fetchAllUsers(mockedUser.email);
        expect(list[0]).toEqual(mockedUser);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });

  describe('fetchUser()', () => {
    it('should fetch a user', async () => {
      try {
        const user = await controller.fetchUser('1');
        expect(user).toBeDefined();
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    it('should throw an error if a user doesn\'t exist', async () => {
      fakeUserService.findOne = () => Promise.resolve(null);
      try {
        await controller.fetchUser('1');
      } catch (error) {
        expect(error.response.message).toEqual('A user not found.');
      }
    });
  });
});