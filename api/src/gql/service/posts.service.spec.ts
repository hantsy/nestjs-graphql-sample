import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';
import { CommentEntity } from '../../database/entity/comment.entity';
import { PostEntity } from '../../database/entity/post.entity';
import { CommentRepository } from '../../database/repository/comment.repository';
import { PostRepository } from '../../database/repository/post.repository';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let comments: CommentRepository;
  let posts: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findByAuthor: jest.fn(),
          },
        },
        {
          provide: CommentRepository,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findByPostId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    comments = module.get<CommentRepository>(CommentRepository);
    posts = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(comments).toBeDefined();
    expect(posts).toBeDefined();
  });

  it('should find all posts', async () => {
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

    const entities = data.map((d) => {
      const e = new PostEntity();
      Object.assign(e, d);
      return e;
    });

    jest
      .spyOn(posts, 'findAll')
      .mockImplementationOnce((keyword: any, skip: any, take: any) => {
        return Promise.resolve(entities);
      });
    const result = await lastValueFrom(
      service.findAll({ keyword: 'test', skip: 0, take: 20 }),
    );
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(posts.findAll).toHaveBeenCalledTimes(1);
    expect(posts.findAll).toBeCalledWith('test', 0, 20);
  });
  it('should find posts by author', async () => {
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

    const entities = data.map((d) => {
      const e = new PostEntity();
      Object.assign(e, d);
      return e;
    });

    jest.spyOn(posts, 'findByAuthor').mockImplementationOnce((autor: any) => {
      return Promise.resolve(entities);
    });
    const result = await lastValueFrom(service.findByAuthor('test'));
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(posts.findByAuthor).toHaveBeenCalledTimes(1);
    expect(posts.findByAuthor).toBeCalledWith('test');
  });
  it('should find one post by id', async () => {
    const data = {
      id: '1',
      title: 'post 1',
      content: 'content 1',
    };

    jest.spyOn(posts, 'findOne').mockResolvedValue(data);
    const result = await lastValueFrom(service.findById('1'));
    console.log('result:', JSON.stringify(result));

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should create post ', async () => {
    const data = {
      id: '1',
      title: 'post 1',
      content: 'content 1',
    };
    jest.spyOn(posts, 'save').mockResolvedValue(data);

    const result = await lastValueFrom(service.createPost('test', data));
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
  });

  it('should create comment of post ', async () => {
    const data = {
      id: '1',
      content: 'test comment',
      post: {
        id: '1',
      },
    };
    jest.spyOn(comments, 'save').mockResolvedValue(data as CommentEntity);

    const result = await lastValueFrom(service.addComment('1', 'test comment'));
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
        },
      },
      {
        id: '2',
        content: 'test comment',
        post: {
          id: '2',
        },
      },
    ];

    jest.spyOn(comments, 'findByPostId').mockImplementationOnce((id: any) => {
      return Promise.resolve(data as CommentEntity[]);
    });
    const result = await lastValueFrom(service.findCommentsByPostId('1'));
    console.log('result: ' + JSON.stringify(result));
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(comments.findByPostId).toHaveBeenCalledTimes(1);
    expect(comments.findByPostId).toBeCalledWith('1');
  });
});
