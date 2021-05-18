import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRepository } from '../../database/repository/user.repository';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  findById(id: string): Observable<User> {
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
