import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { UserRepository } from '../../database/repository/user.repository';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  findOneById(id: number): Observable<User> {
    return from(this.userRepository.findOne(id)).pipe(
      map((e, idx) => {
        return {
          id: e.id,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
        } as User;
      }),
    );
  }
}
