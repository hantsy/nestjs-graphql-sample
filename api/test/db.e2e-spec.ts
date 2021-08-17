import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CommentRepository } from '../src/database/repository/comment.repository';
import { PostRepository } from '../src/database/repository/post.repository';
import { UserRepository } from '../src/database/repository/user.repository';
import { UserEntity } from '../src/database/entity/user.entity';
import { PostEntity } from '../src/database/entity/post.entity';
import { CommentEntity } from '../src/database/entity/comment.entity';
import { PostsDataInitializer } from '../src/database/posts-data-initializer';

describe('Database integration test', () => {
  let posts: PostRepository;
  let comments: CommentRepository;
  let users: UserRepository;
  let init: PostsDataInitializer;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    posts = app.get<PostRepository>(PostRepository);
    comments = app.get<CommentRepository>(CommentRepository);
    users = app.get<UserRepository>(UserRepository);

    // call this initializer to reset the data
    init = app.get<PostsDataInitializer>(PostsDataInitializer);

    await init.onModuleInit();
  });

  it('smoke tests for repositories', async () => {
    const user = new UserEntity();
    Object.assign(user, {
      id: 'e2etest@id',
      email: 'e2e@example.com',
    });

    const saved = await users.save(user);
    expect(saved).toBeDefined();
    console.log('saved user:', saved);

    const byEmail = await users.findByEmail('e2e@example.com');
    expect(byEmail).toBeDefined();
    expect(saved.id).toEqual(byEmail.id);

    const post = new PostEntity();
    Object.assign(post, {
      title: 'e2e test',
      content: 'e2e content',
      author: saved,
    });

    const savedPost = await posts.save(post);
    expect(savedPost).toBeDefined();
    const postsByAuthor = await posts.findByAuthor(saved.id);
    expect(postsByAuthor.length).toEqual(1);
    expect(postsByAuthor[0].id).toEqual(savedPost.id);

    const comment = new CommentEntity();
    Object.assign(comment, {
      post: savedPost,
      content: 'e2e content',
    });

    const savedComment = await comments.save(comment);
    expect(savedComment).toBeDefined();
    const commnentsByPostId = await comments.findByPostId(savedPost.id);
    expect(commnentsByPostId.length).toEqual(1);
    expect(commnentsByPostId[0].id).toEqual(savedComment.id);

    //clean the resouses.
    // comments.remove(savedComment);
    // posts.remove(savedPost);
    // users.remove(saved);
  });
});
