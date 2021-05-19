import { ConfigType } from '@nestjs/config';
import {
  Connection,
  createConnection,
  QueryRunner,
  EntityManager,
  ConnectionOptions,
} from 'typeorm';
import dbConfig from '../config/db.config';
import { UserRepository } from './repository/user.repository';
import { PostRepository } from './repository/post.repository';
import { CommentRepository } from './repository/comment.repository';

export const databaseConnectionProviders = [
  {
    provide: Connection,
    useFactory: async (
      cfg: ConfigType<typeof dbConfig>,
    ): Promise<Connection> => {
      const options = Boolean(cfg.url)
        ? {
            type: cfg.type,
            url: cfg.url,
          }
        : {
            type: cfg.type,
            host: cfg.host,
            port: cfg.port,
            database: cfg.database,
            username: cfg.username,
            password: cfg.password,
          };

      Object.assign(options, {
        entities: ['dist/**/entity/*.js'],
        autoLoadEntities: true,
        logging: true,
      });
      return await createConnection(options as ConnectionOptions);
    },
    inject: [dbConfig.KEY],
  },
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
