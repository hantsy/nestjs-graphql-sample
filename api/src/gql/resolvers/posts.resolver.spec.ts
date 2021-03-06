import { Test, TestingModule } from '@nestjs/testing';
import { PubSub } from 'graphql-subscriptions';
import { of } from 'rxjs';
import { Comment } from '../types/comment.model';
import { Post } from '../types/post.model';
import { PostsResolver } from './posts.resolver';
import { PostsService } from '../service/posts.service';
import PostsLoaders from '../service/posts.loaders';
import { PostInput } from '../dto/post.input';
import { lastValueFrom } from 'rxjs';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  let posts: PostsService;
  let pubSub: PubSub;

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
        {
          provide: PostsLoaders,
          useValue: { new: jest.fn(), constructor: jest.fn() },
        },
        {
          provide: PubSub,
          useValue: {
            publish: jest.fn(),
            asyncIterator: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
    posts = module.get<PostsService>(PostsService);
    pubSub = module.get<PubSub>(PubSub);
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
    const result = await lastValueFrom(
      resolver.getAllPosts({ keyword: 'test', skip: 0, take: 20 }),
    );
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
    } as Post;
    const inputData = {
      id: '1',
      title: 'post 1',
      content: 'content 1',
    } as PostInput;
    jest.spyOn(posts, 'createPost').mockReturnValue(of(data));

    const result = await lastValueFrom(
      resolver.createPost({ userId: 'test' }, inputData),
    );
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
    const postsAddCommentSpy = jest
      .spyOn(posts, 'addComment')
      .mockReturnValue(of(data));
    const pubSubPublishSpy = jest.spyOn(pubSub, 'publish');

    const result = await lastValueFrom(
      resolver.addComment({ postId: '1', content: 'test comment' }),
    );
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(postsAddCommentSpy).toBeCalled();
    expect(pubSubPublishSpy).toBeCalled();
  });

  it('should subscribe comment ', async () => {
    const pubSubPublishSpy = jest.spyOn(pubSub, 'asyncIterator');

    resolver.addCommentHandler();
    expect(pubSubPublishSpy).toBeCalled();
  });

  it('should resolve all comments of post', async () => {
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

    const findCommentsOfPostSpy = jest
      .spyOn(posts, 'findCommentsOfPost')
      .mockReturnValue(of(data));
    const result = await lastValueFrom(resolver.comments({ id: '1' } as Post));
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findCommentsOfPostSpy).toHaveBeenCalledTimes(1);
    expect(findCommentsOfPostSpy).toBeCalledWith('1');
  });
});
