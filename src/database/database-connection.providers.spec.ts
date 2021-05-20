jest.mock('typeorm', () => ({
  createConnection: jest
    .fn()
    .mockImplementation((options: ConnectionOptions) =>
      Promise.resolve({} as Connection),
    ),
  Connection: jest.fn(),
}));

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, createConnection } from 'typeorm';
import dbConfig from '../config/db.config';
import { databaseConnectionProviders } from './database-connection.providers';
import { ConnectionOptions } from 'tls';

describe('DatabaseConnectionProviders', () => {
  let conn: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(dbConfig)],
      providers: [...databaseConnectionProviders],
    }).compile();

    conn = module.get<Connection>(Connection);
  });

  it('Connection should be defined', () => {
    expect(conn).toBeDefined();
  });

  it('createConnection is called', () => {
    expect(createConnection).toBeCalled();
  });
});
