import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create fake usersService
    const users: User[] = [];

    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // create DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('wahba@gmail.com', '123123123');
    const hashedPass = user.password;
    const salt = hashedPass.slice(0, 29);
    const hashed = hashedPass.slice(29);
    expect(salt).toBeDefined();
    expect(hashed).toBeDefined();
  });

  it('throw if users signs up with an email that already exist', async () => {
    await service.signup('wahba1@gmail.com', '123123123');
    try {
      await service.signup('wahba1@gmail.com', '123123123');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('This email already exist');
    }
  });

  it('throws if the users signs in with unused email', async () => {
    try {
      await service.login('wahba@gmail.com', '123123123');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Invalid Credentials');
    }
  });

  it('throws if invalid password is provided ', async () => {
    await service.signup('wahba111@gmail.com', 'wqeqwewqe');
    try {
      await service.login('wahba111@gmail.com', '12352123dwqe');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Invalid Credentials');
    }
  });

  it('returns a user if the provided password is correct', async () => {
    await service.signup('wahba12343@gmail.com', '123123123');
    const user = await service.login('wahba12343@gmail.com', '123123123');
    expect(user).toBeDefined();
  });
});
