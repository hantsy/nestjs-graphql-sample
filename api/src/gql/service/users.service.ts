import { EMPTY, from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { In, InsertResult } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../database/entity/user.entity';
import { UserRepository } from '../../database/repository/user.repository';
import { User } from '../types/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  update(user: {
    id: string;
    email: string;
    name: string;
  }): Observable<boolean> {
    //const updateStr = ["name"].map(key => `"${key}" = EXCLUDED."${key}"`).join(",");
    //.onConflict(`("email") DO UPDATE SET ${updateStr}`)

    const result: Promise<InsertResult> = this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(user)
      //.onConflict(`("email") DO NOTHING`)
      .orUpdate(['name'], ['email'])
      .execute();

    return from(result).pipe(
      tap((r) => console.log(r)),
      map((r) => r.raw != undefined),
    );
  }

  findById(id: string): Observable<User> {
    return from(this.userRepository.findOne(id)).pipe(
      switchMap((u) => (u ? of(u) : EMPTY)),
      map((e, idx) => {
        return {
          id: e.id,
          name: e.name,
          email: e.email,
        } as User;
      }),
    );
  }

  findByIds(ids: string[]): Observable<User[]> {
    return from(
      this.userRepository.find({
        where: { id: In(ids) },
      }),
    ).pipe(
      map((ua) => {
        return ua.map((u) => {
          const { id, email, name } = u;
          return { id, email, name } as User;
        });
      }),
    );
  }
}
