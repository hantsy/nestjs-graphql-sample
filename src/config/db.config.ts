import { registerAs } from '@nestjs/config';
export default registerAs(
  'db',
  () =>
    ({
      type: process.env.DB_TYPE || 'postgres',
      url: process.env.DB_URL || 'postgres://user:password@localhost/blogdb',
      //   host: process.env.DB_HOST || 'localhost',
      //   port: process.env.DB_PORT || 5432,
      //   database: process.env.DB_NAME || 'blogdb',
      //   username: process.env.DB_USERNAME || 'user',
      //   password: process.env.DB_PASSWORD || 'password',
    } as {
      type: string;
      url?: string;
      host?: string;
      port?: number;
      database?: string;
      username?: string;
      password?: string;
    }),
);
