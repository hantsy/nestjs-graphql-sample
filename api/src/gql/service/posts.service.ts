import { EMPTY, from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { PostEntity } from '../../database/entity/post.entity';
import { CommentRepository } from '../../database/repository/comment.repository';
import { PostRepository } from '../../database/repository/post.repository';
import { PostInput } from '../dto/post.input';
import { PostsArgs } from '../dto/posts.arg';
import { Comment } from '../types/comment.model';
import { Post } from '../types/post.model';
import { CommentEntity } from '../../database/entity/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  findById(id: string): Observable<Post> {
    return from(this.postRepository.findOne(id)).pipe(
      switchMap((p) => (p ? of(p) : EMPTY)),
      map((e, idx) => this.mapAsModel(e)),
    );
  }

  findAll(args: PostsArgs): Observable<Post[]> {
    return from(
      this.postRepository.findAll(args.keyword, args.skip, args.take),
    ).pipe(
      //tap((e) => console.log('tap:', JSON.stringify(e))),
      map((entities, idx) => this.mapAsModelArray(entities)),
      // tap((e) => console.log(e)),
    );
  }

  createPost(authorId: string, data: PostInput): Observable<Post> {
    return from(
      this.postRepository.save({
        id: data.id,
        title: data.title,
        content: data.content,
        author: {
          id: authorId,
        },
      }),
    ).pipe(map((e, idx) => this.mapAsModel(e)));
  }

  findByAuthor(id: string): Observable<Post[]> {
    return from(this.postRepository.findByAuthor(id)).pipe(
      map((e, idx) => this.mapAsModelArray(e)),
    );
  }

  findCommentsByPostId(id: string): Observable<Comment[]> {
    return from(this.commentRepository.findByPostId(id)).pipe(
      map((e, idx) =>
        e.map((c) => {
          return { id: c.id, content: c.content } as Comment;
        }),
      ),
    );
  }

  findCommentsByPostIds(ids: string[]): Observable<Comment[]> {
    return from(
      this.commentRepository.find({
        where: { postId: In(ids) },
      }),
    ).pipe(
      map((e, idx) =>
        e.map((c) => {
          return { id: c.id, postId: c.postId,  content: c.content } as Comment;
        }),
      ),
    );
  }

  addComment(id: string, comment: string): Observable<Comment> {
    const entity = new CommentEntity();
    Object.assign(entity, {
      content: comment,
      postId: id,
    });
    return from(this.commentRepository.save(entity)).pipe(
      map((c) => {
        return { id: c.id, content: c.content } as Comment;
      }),
    );
  }

  private mapAsModel(e: PostEntity): Post {
    return {
      id: e.id,
      title: e.title,
      content: e.content,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      authorId: e.authorId,
    };
  }

  private mapAsModelArray(entities: PostEntity[]): Post[] {
    return entities.map((e) => {
      return {
        id: e.id,
        title: e.title,
        content: e.content,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        authorId: e.authorId,
      };
    });
  }
}
