import { Test, TestingModule } from '@nestjs/testing';
import { Connection, EntityManager } from 'typeorm';
import { databaseRepositoriesProviders } from './database-repositories.providers';
import { PostRepository } from './repository/post.repository';
import { CommentRepository } from './repository/comment.repository';
import { UserRepository } from './repository/user.repository';

describe('DatabaseRepositoriesProviders', () => {
  let conn: any;
  let users: any;
  let posts: any;
  let comments: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...databaseRepositoriesProviders,

        {
          provide: Connection,
          useValue: {
            createEntityManager: jest.fn().mockReturnValue({} as EntityManager),
            getCustomRepository: jest
              .fn()
              .mockReturnValue(
                {} as UserRepository | PostRepository | CommentRepository,
              ),
          },
        },
      ],
    }).compile();

    conn = module.get<Connection>(Connection);
    users = module.get<PostRepository>(PostRepository);
    posts = module.get<PostRepository>(PostRepository);
    comments = module.get<CommentRepository>(CommentRepository);
  });

  it('Connection should be defined', () => {
    expect(conn).toBeDefined();
  });

  it('UserRepository should be defined', () => {
    expect(users).toBeDefined();
  });

  it('PostRepository should be defined', () => {
    expect(posts).toBeDefined();
  });

  it('CommentRepository should be defined', () => {
    expect(comments).toBeDefined();
  });
});
