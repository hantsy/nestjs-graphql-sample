import { ConfigModule, ConfigType } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import dbConfig from './db.config';

describe('dbConfig', () => {
  let config: ConfigType<typeof dbConfig>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(dbConfig)],
    }).compile();

    config = module.get<ConfigType<typeof dbConfig>>(dbConfig.KEY);
  });

  it('should be defined', () => {
    expect(dbConfig).toBeDefined();
  });

  it('should contains type, host, port, database, username, password', async () => {
    expect(config.type).toBe('postgres');
    expect(config.url).toBe('postgres://user:password@localhost/blogdb');
    // expect(config.host).toBe('localhost');
    // expect(config.port).toBe(5432);
    // expect(config.database).toBe('blogdb');
    // expect(config.username).toBe('user');
    // expect(config.password).toBe('password');
  });
});
