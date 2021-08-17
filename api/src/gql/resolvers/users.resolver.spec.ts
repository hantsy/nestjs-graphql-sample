import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom, of } from 'rxjs';
import { Post } from '../types/post.model';
import { PostsService } from '../service/posts.service';
import { User } from '../types/user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from '../service/users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let users: UsersService;
  let posts: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: PostsService,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findByAuthor: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    users = module.get<UsersService>(UsersService);
    posts = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(users).toBeDefined();
    expect(posts).toBeDefined();
  });

  it('should resolve one user by id', async () => {
    const data = {
      id: '1',
      firstName: 'test firstName',
      lastName: 'test lastName',
      email: 'hantsy@example.com',
    };

    jest.spyOn(users, 'findById').mockReturnValue(of(data));
    const result = await lastValueFrom(resolver.getUserById('1'));
    console.log('result:', JSON.stringify(result));

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should resolve posts by author', async () => {
    const data = [
      {
        id: '1',
        title: 'post 1',
        content: 'content 1',
      },
      {
        id: '2',
        title: 'post 2',
        content: 'content 2',
      },
    ];

    jest.spyOn(posts, 'findByAuthor').mockReturnValue(of(data as Post[]));
    const result = await lastValueFrom(resolver.posts({ id: '1' } as User));
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(posts.findByAuthor).toHaveBeenCalledTimes(1);
    expect(posts.findByAuthor).toBeCalledWith('1');
  });
});
