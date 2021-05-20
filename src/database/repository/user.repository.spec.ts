import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from './user.repository';

// see: https://stackoverflow.com/questions/67580233/how-to-test-custom-repository-in-nestjs-typeorm-applications
describe('UserRepository with DI', () => {
  let users: any;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: createMock<UserRepository>({
            //findOne: jest.fn(),
          }),
        },
      ],
    }).compile();
    users = app.get<UserRepository>(UserRepository);
  });

  it('should call findOne', async () => {
    expect(typeof users.findOne).toBe('function');
    expect(typeof users.findByEmail).toBe('function');

    // TODO: how to verify the findByEmail called findOne???
    //
    // await users.findByEmail('test@example.com');
    // expect(findOneSpy).toBeCalledWith({
    //   email: 'test@example.com',
    // });
  });
});

describe('UserRepository without DI(with jest-mock-extended)', () => {
  const users: MockProxy<UserRepository> = mock<UserRepository>();

  it('should call findOne', async () => {
    const findOneSpy = users.findOne.mockImplementation((options: any) =>
      Promise.resolve({
        firstName: 'test',
        email: 'test@example.com',
      } as UserEntity),
    );

    expect(await users.findOne({ email: 'test@example.com' })).toEqual({
      firstName: 'test',
      email: 'test@example.com',
    });

    users.findByEmail.mockRestore();
    await users.findByEmail('test@example.com');
    expect(findOneSpy).toBeCalledWith({
      email: 'test@example.com',
    });
  });
});
