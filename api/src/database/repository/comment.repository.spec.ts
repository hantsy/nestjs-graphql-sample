import { Test, TestingModule } from '@nestjs/testing';
import { Repository, EntityManager, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../entity/post.entity';
import { CommentRepository } from './comment.repository';
import { PostRepository } from './post.repository';

describe('CommentRepository', () => {
  let commentRepository: CommentRepository;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentRepository,
        { provide: EntityManager, useValue: { find: jest.fn() } },
      ],
    }).compile();

    commentRepository = module.get<CommentRepository>(CommentRepository);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe('findByPostId', () => {
    it('should return comments by post id', async () => {
      const postId = 'postId';
      const posts = [
        { content: 'test conent' },
        {  content: 'test conent' },
      ];

      const queryBuilderSpy = jest
        .spyOn(Repository.prototype, 'createQueryBuilder')
        .mockReturnValue(SelectQueryBuilder.prototype);
      const whereSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'where')
        .mockReturnThis();
      const setParameterSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'setParameter')
        .mockReturnThis();
      // the same goes for setParameter, skip and take methods
      const getManySpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'getMany')
        .mockResolvedValue(posts);

      const foundPosts = await commentRepository.findByPostId(postId);
      expect(foundPosts).toEqual(posts);
      expect(whereSpy).toHaveBeenCalledWith('comment.post.id=:id');
      expect(setParameterSpy).toHaveBeenCalledWith('id', postId);
    });
  });
});
