import { Test, TestingModule } from '@nestjs/testing';
import { Repository, EntityManager, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../entity/post.entity';
import { PostRepository } from './post.repository';

describe('PostRepository', () => {
  let postRepository: PostRepository;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostRepository,
        { provide: EntityManager, useValue: { find: jest.fn() } },
      ],
    }).compile();

    postRepository = module.get<PostRepository>(PostRepository);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe('findByAuthor', () => {
    it('should return posts by author', async () => {
      const author = 'testid';
      const posts = [
        { title: 'test title', content: 'test conent' },
        { title: 'test title', content: 'test conent' },
      ];

      Object.defineProperty(Repository.prototype, 'manager', {
        value: manager,
      });

      const findSpy = jest.spyOn(manager, 'find').mockResolvedValue(posts);

      const foundPosts = await postRepository.findByAuthor(author);
      expect(foundPosts).toEqual(posts);
      expect(findSpy).toHaveBeenCalledWith(PostEntity, {
        author: { id: author },
      });
    });
  });

  describe('findAll', () => {
    it('should return posts by search creteria', async () => {
      const keyword = 'test';
      const posts = [
        { title: 'test title', content: 'test conent' },
        { title: 'test title', content: 'test conent' },
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
      const skipSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'skip')
        .mockReturnThis();
      const takeSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'take')
        .mockReturnThis();
      // the same goes for setParameter, skip and take methods
      const getManySpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'getMany')
        .mockResolvedValue(posts);

      const foundPosts = await postRepository.findAll(keyword, 0, 10);
      expect(foundPosts).toEqual(posts);
      expect(whereSpy).toHaveBeenCalledWith('p.title like :q or p.content like :q');
      expect(setParameterSpy).toHaveBeenCalledWith('q', '%' + keyword + '%');
      expect(skipSpy).toHaveBeenCalledWith(0);
      expect(takeSpy).toHaveBeenCalledWith(10);
    });
  });
});
