import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestModule } from '@devniel/nestjs-typeorm-testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let usersCustomRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule.forTest([UserRepository])],
      providers: [UserRepository],
    }).compile();
    usersCustomRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(usersCustomRepository).toBeDefined();
  });

  it('findByEmail should call parent findOne() method', async () => {
    const spyfindOne = jest.spyOn(usersCustomRepository, 'findOne');
    await usersCustomRepository.findByEmail('test');
    expect(spyfindOne).toHaveBeenCalledTimes(1);
  });
});
