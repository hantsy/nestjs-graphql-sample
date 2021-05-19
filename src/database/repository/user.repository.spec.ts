// jest.mock('typeorm', () => ({
//   createConnection: jest.fn(),
//   getConnection: jest.fn(),
//   Connection: jest.fn(),
// }));

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createConnection, getConnection, Connection } from 'typeorm';
import { User } from '../../users/models/user.model';
import { UserRepository } from './user.repository';
import { mock } from 'jest-mock-extended';

// see: https://stackoverflow.com/questions/67580233/how-to-test-custom-repository-in-nestjs-typeorm-applications
describe('UserRepository', () => {
  let local;
  let parentMock;
  let users: UserRepository;

  beforeEach(async () => {
    local = Object.getPrototypeOf(UserRepository);
    parentMock = {
      new: jest.fn(),
      construtor: jest.fn(),
      findOne: jest.fn(),
    };
    Object.setPrototypeOf(UserRepository, parentMock);

    // const app: TestingModule = await Test.createTestingModule({
    //   imports: [TmModule.forFeature([User, UserRepository])],
    //   providers: [
    //     {
    //       provide: Connection,
    //       useFactory: () => {
    //         transaction: jest.fn();
    //       },
    //     },
    //   ],
    // }).compile();

    // users = app.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    Object.setPrototypeOf(UserRepository, local);
  });

  it('TODO: should call findOne', async () => {
    const findByEmailSpy = jest.spyOn(parentMock, 'findOne');
    // const users = new UserRepository();
    // console.log('users :', JSON.stringify(users));
    // await users.findByEmail('test@example.com');
    // expect(parentMock.mock.calls.length).toBe(1);
    // expect(findByEmailSpy).toBeCalledWith({
    //   email: 'test@example.com',
    // });
  });
});
