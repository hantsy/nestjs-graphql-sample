import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ email: email });
  }
}
