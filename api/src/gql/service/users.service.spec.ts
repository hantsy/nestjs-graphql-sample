import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';
import { UserRepository } from '../../database/repository/user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let users: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findByAuthor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    users = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(users).toBeDefined();
  });

  it('should find one user by id', async () => {
    const data = {
      id: '1',
      firstName: 'test firstName',
      lastName: 'test lastName',
      email: 'hantsy@example.com',
    };

    jest.spyOn(users, 'findOne').mockResolvedValue(data);
    const result = await lastValueFrom(service.findById('1'));
    console.log('result:', JSON.stringify(result));

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });
});
