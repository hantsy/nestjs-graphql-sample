import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { PostsService } from '../service/posts.service';
import { UsersService } from '../service/users.service';
import { Comment } from '../types/comment.model';
import { User } from '../types/user.model';
import PostsLoaders from './posts.loaders';

describe('PostsLoaders', () => {
  let loaders: PostsLoaders;
  let posts: PostsService;
  let users: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsLoaders,
        {
          provide: PostsService,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findCommentsByPostIds: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();


    // resovle a REQUEST scoped component
    loaders = await module.resolve<PostsLoaders>(PostsLoaders);
    posts = module.get<PostsService>(PostsService);
    users = module.get<UsersService>(UsersService);
  });

  it('defined', () => {
    expect(loaders).toBeDefined();
  });

  it('loadAuthors', async () => {
    const data = [
      { id: '1', email: 'user@example.com' },
      { id: '2', email: 'user@example.com' },
    ] as User[];
    const findByIdsSpy = jest.spyOn(users, 'findByIds').mockReturnValue(of(data));
    const loadedUsers = await loaders.loadAuthors.load("1");
    expect(loadedUsers).toEqual( { id: '1', email: 'user@example.com' });
    expect(findByIdsSpy).toHaveBeenCalled();
  });

  it('loadComments', async () => {
    const data = [
      { id: '1', postId:'2', content:'test content' },
      { id: '2', postId:'2', content: 'test content 2' },
    ] as Comment[];
    const findCommentsByPostIdSpy = jest.spyOn(posts, 'findCommentsByPostIds').mockReturnValue(of(data));
    const loadedData = await loaders.loadComments.load("2");
    expect(loadedData).toEqual( data);
    expect(findCommentsByPostIdSpy).toHaveBeenCalled();
  });
});
