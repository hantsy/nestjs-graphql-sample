import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import auth0Config from '../config/auth0.config';
import { JwtStrategy } from './jwt.strategy';
import { PermissionType } from './permission-type.enum';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let config: ConfigType<typeof auth0Config>;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: auth0Config.KEY,
          useValue: {
            audience: 'http://api',
            issuerUri: 'http://test/',
          },
        },
      ],
    }).compile();

    strategy = app.get<JwtStrategy>(JwtStrategy);
    config = app.get<ConfigType<typeof auth0Config>>(auth0Config.KEY);
  });

  describe('validate', () => {
    it('should return user principal if user and password is provided ', async () => {
      expect(config.audience).toBe('http://api');
      expect(config.issuerUri).toBe('http://test/');
      const user = await strategy.validate({
        sub: 'testsub',
        email: 'test@example.com',
        permissions: ['write:posts'],
      });
      expect(user.email).toEqual('test@example.com');
      expect(user.permissions).toEqual([<PermissionType>'write:posts']);
    });
  });
});

describe('JwtStrategy(call supper)', () => {
  let local;
  let parentMock;

  beforeEach(() => {
    local = Object.getPrototypeOf(JwtStrategy);
    parentMock = jest.fn();
    Object.setPrototypeOf(JwtStrategy, parentMock);
  });

  afterEach(() => {
    Object.setPrototypeOf(JwtStrategy, local);
  });

  it('should call constructor', () => {
    const config = mock<ConfigType<typeof auth0Config>>();
    config.audience = 'http://api';
    config.issuerUri = 'http://test/';
    new JwtStrategy(config);
    expect(parentMock.mock.calls.length).toBe(1);

    expect(parentMock.mock.calls[0][0].jwtFromRequest).toBeDefined();
    expect(parentMock.mock.calls[0][0].ignoreExpiration).toBeFalsy();
    expect(parentMock.mock.calls[0][0].audience).toBe('http://api');
    expect(parentMock.mock.calls[0][0].issuer).toBe('http://test/');
    expect(parentMock.mock.calls[0][0].secretOrKeyProvider).toBeDefined();
  });
});
