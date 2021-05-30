import { ConfigModule, ConfigType } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import auth0Config from './auth0.config';

describe('auth0Config', () => {
  let config: ConfigType<typeof auth0Config>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(auth0Config)],
    }).compile();

    config = module.get<ConfigType<typeof auth0Config>>(auth0Config.KEY);
  });

  it('should be defined', () => {
    expect(auth0Config).toBeDefined();
  });

  it('should contains audience and issuerUri', async () => {
    expect(config.audience).toBe('https://hantsy.github.io/api');
    expect(config.issuerUri).toBe('https://dev-ese8241b.us.auth0.com/');
  });
});
