import { Connection, EntityManager } from 'typeorm';
import { CommentRepository } from './repository/comment.repository';
import { PostRepository } from './repository/post.repository';
import { UserRepository } from './repository/user.repository';

export const databaseRepositoriesProviders = [
  {
    provide: EntityManager,
    useFactory: (conn: Connection) => conn.createEntityManager(),
    inject: [Connection],
  },
  //   {
  //     provide: 'QueryRunner',
  //     useFactory: (conn: Connection) => conn.createQueryRunner(),
  //     inject: [Connection],
  //   },
  {
    provide: UserRepository,
    useFactory: (conn: Connection) => conn.getCustomRepository(UserRepository),
    inject: [Connection],
  },

  {
    provide: PostRepository,
    useFactory: (conn: Connection) => conn.getCustomRepository(PostRepository),
    inject: [Connection],
  },
  {
    provide: CommentRepository,
    useFactory: (conn: Connection) =>
      conn.getCustomRepository(CommentRepository),
    inject: [Connection],
  },
];
