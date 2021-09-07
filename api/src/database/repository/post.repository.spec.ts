import { Test, TestingModule } from '@nestjs/testing';
import { Repository, EntityManager } from 'typeorm';
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
});
