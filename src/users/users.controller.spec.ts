import { User } from './user.entity';
import { UserService } from './services/users.service';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './services/auth.service';;

const mockEmail = 'test@gmail.com';
const mockPassword = '12345';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => Promise.resolve({ id, email: mockEmail, password: mockPassword } as User),
      find: (email: string) => Promise.resolve([]),
      update: (id: number, dataToUpdate: Partial<User>) => Promise.resolve({ id, email: mockEmail, password: mockPassword } as User),
      remove: (id: number) => Promise.resolve({ id, email: mockEmail, password: mockPassword } as User)
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
});