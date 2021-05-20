import { ConfigType } from '@nestjs/config';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  EntityManager,
} from 'typeorm';
import dbConfig from '../config/db.config';

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

  //   {
  //     provide: 'QueryRunner',
  //     useFactory: (conn: Connection) => conn.createQueryRunner(),
  //     inject: [Connection],
  //   },
];
