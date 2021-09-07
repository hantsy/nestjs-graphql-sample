import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findByEmail', () => {
    it('should return found user', async () => {
      const email = 'email';
      const user = {
        email,
      };
      const findOneSpy = jest
        .spyOn(Repository.prototype, 'findOne')
        .mockResolvedValue(user);

      const foundUser = await userRepository.findByEmail(email);
      expect(foundUser).toEqual(user);
      expect(findOneSpy).toHaveBeenCalledWith(user);
    });
  });
});