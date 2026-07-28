import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostService } from './post.service';
import { Post, PostDocument } from './post.schema';
import { Comment, CommentDocument } from './comment.schema';
import { NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  let postModel: Model<PostDocument>;
  let commentModel: Model<CommentDocument>;

  const mockPost = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Post',
    content: 'Test content with enough characters',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(this),
  };

  const mockPostModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockPost]),
          }),
        }),
      }),
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPost),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPost),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPost),
    }),
    deleteMany: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    }),
  };

  const mockCommentModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    }),
    deleteMany: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getModelToken(Post.name), useValue: mockPostModel },
        { provide: getModelToken(Comment.name), useValue: mockCommentModel },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
    commentModel = module.get<Model<CommentDocument>>(
      getModelToken(Comment.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all posts', async () => {
    const posts = await service.findAll({ keyword: '', skip: 0, take: 25 });
    expect(posts).toEqual([mockPost]);
    expect(postModel.find).toHaveBeenCalled();
  });

  it('should find post by id', async () => {
    const post = await service.findById('507f1f77bcf86cd799439011');
    expect(post).toEqual(mockPost);
    expect(postModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

  it('should throw NotFoundException for missing post', async () => {
    jest.spyOn(mockPostModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(null),
    } as any);
    await expect(
      service.findById('nonexistent'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should count all posts', async () => {
    const count = await service.countAll({ keyword: '' });
    expect(count).toBe(1);
  });

  it('should delete post and comments', async () => {
    const result = await service.delete('507f1f77bcf86cd799439011');
    expect(result).toBe(true);
    expect(commentModel.deleteMany).toHaveBeenCalled();
  });
});
