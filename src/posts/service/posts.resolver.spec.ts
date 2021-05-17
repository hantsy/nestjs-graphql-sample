import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  let posts: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PostsService,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findOne: jest.fn(),
            createPost: jest.fn(),
            addComment: jest.fn(),
            findAll: jest.fn(),
            findByAuthor: jest.fn(),
            findCommentsOfPost: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
    posts = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(posts).toBeDefined();
  });

  it('should resolve all posts', async () => {
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

    jest.spyOn(posts, 'findAll').mockReturnValue(of(data));
    const result = await resolver
      .getAllPosts({ keyword: 'test', skip: 0, take: 20 })
      .toPromise();
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(posts.findAll).toHaveBeenCalledTimes(1);
    expect(posts.findAll).toBeCalledWith({
      keyword: 'test',
      skip: 0,
      take: 20,
    });
  });

  it('should create post ', async () => {
    const data = {
      id: '1',
      title: 'post 1',
      content: 'content 1',
    };
    jest.spyOn(posts, 'createPost').mockReturnValue(of(data));

    const result = await resolver.createPost(data).toPromise();
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should create comment of post ', async () => {
    const data = {
      id: '1',
      content: 'test comment',
      post: {
        id: '1',
      } as Post,
    };
    jest.spyOn(posts, 'addComment').mockReturnValue(of(data));

    const result = await resolver
      .addComment({ postId: '1', content: 'test comment' })
      .toPromise();
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should find all comments of post', async () => {
    const data = [
      {
        id: '1',
        content: 'test comment',
        post: {
          id: '1',
        } as Post,
      },
      {
        id: '2',
        content: 'test comment',
        post: {
          id: '2',
        } as Post,
      },
    ] as Comment[];

    jest.spyOn(posts, 'findCommentsOfPost').mockReturnValue(of(data));
    const result = await resolver.comments({ id: '1' } as Post).toPromise();
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(posts.findCommentsOfPost).toHaveBeenCalledTimes(1);
    expect(posts.findCommentsOfPost).toBeCalledWith('1');
  });
});
