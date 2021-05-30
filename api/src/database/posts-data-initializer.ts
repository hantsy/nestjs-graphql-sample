import { Injectable, OnModuleInit } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PostEntity } from './entity/post.entity';
import { PostRepository } from './repository/post.repository';
import { UserEntity } from './entity/user.entity';
import { CommentEntity } from './entity/comment.entity';

@Injectable()
export class PostsDataInitializer implements OnModuleInit {
  private data: any[] = [
    {
      title: 'Generate a NestJS project',
      content: 'content',
    },
    {
      title: 'Create GrapQL APIs',
      content: 'content',
    },
    {
      title: 'Connect to Postgres via TypeORM',
      content: 'content',
    },
  ];

  constructor(
    private readonly postRepository: PostRepository,
    private readonly manager: EntityManager,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.manager.transaction(async (mgr) => {
      // NOTE: you must perform all database operations using the given manager instance
      // it's a special instance of EntityManager working with this transaction
      // and don't forget to await things here

      const commentDel = await mgr.delete(CommentEntity, {});
      console.log('comments deleted: ', commentDel.affected);

      const del = await mgr.delete(PostEntity, {});
      console.log('posts deleted: ', del.affected);

      const userDel = await mgr.delete(UserEntity, {});
      console.log('users deleted: ', userDel.affected);

      const user = new UserEntity();

      Object.assign(user, {
        id: 'test@id',
        email: 'hantsy@gmail.com',
        name: 'hantsy',
      });

      await mgr.save(user);
      await Promise.all(
        this.data.map(async (d) => {
          const p = new PostEntity();
          Object.assign(p, d);
          p.author = user;

          const c = new CommentEntity();
          c.content = 'test comment at:' + new Date();
          p.comments = Promise.resolve([c]);
          await mgr.save(p);
        }),
      );
    });

    const post = new PostEntity();
    post.title = 'test title';
    post.content = 'test content';
    const user = new UserEntity();
    Object.assign(user, {
      id: 'test@id2',
      email: 'hantsy2@gmail.com',
      name: 'hantsy2',
    });
    this.manager.save<UserEntity>(user);
    post.author = user;
    const comment = new CommentEntity();
    comment.content = 'test comment';
    post.comments = Promise.resolve([comment]);
    const saved = await this.postRepository.save(post);
    console.log('saved from repository: ', JSON.stringify(saved));

    const savedPosts = await this.postRepository.find({
      relations: ['comments', 'author'],
    });
    console.log('saved:', JSON.stringify(savedPosts));
  }
}
