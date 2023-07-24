import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'wqeqwe@gmail.com',
          password: '12dwqdeqe',
        } as User);
      },
      find: async (email: string) => {
        const user = new User();
        user.id = 123;
        user.email = email;
        user.password = '12dwqdeqe';
        return [user];
      },
      // remove: (id: number) => {},
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      login: async (email, password) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns all users with a given email', async () => {
    const users = await controller.findAllUsers('wahba123@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('wahba123@gmail.com'); // Update email to match the input
  });

  it('findUser returns single user with the given id ', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser(1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found');
    }
  });

  it('signin updates session object and return new user', async () => {
    const session = { userId: 123 };
    const user = await controller.login(
      { email: 'wahba@gmail.com', password: '123123123' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
