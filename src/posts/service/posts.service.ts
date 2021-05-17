import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PostEntity } from '../../database/entity/post.entity';
import { CommentRepository } from '../../database/repository/comment.repository';
import { PostRepository } from '../../database/repository/post.repository';
import { CreatePostInput } from '../dto/create-post.input';
import { PostsArgs } from '../dto/posts.arg';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  findById(id: string): Observable<Post> {
    return from(this.postRepository.findOne(id)).pipe(
      map((e, idx) => this.mapAsModel(e)),
    );
  }

  findAll(args: PostsArgs): Observable<Post[]> {
    return from(
      this.postRepository.findAll(args.keyword, args.skip, args.take),
    ).pipe(
      //tap((e) => console.log('tap:', JSON.stringify(e))),
      map((entities, idx) => this.mapAsModelArray(entities)),
    );
  }

  createPost(data: CreatePostInput): Observable<Post> {
    return from(
      this.postRepository.save({
        title: data.title,
        content: data.content,
      }),
    ).pipe(map((e, idx) => this.mapAsModel(e)));
  }

  findByAuthor(id: string): Observable<Post[]> {
    return from(this.postRepository.findByAuthor(id)).pipe(
      map((e, idx) => this.mapAsModelArray(e)),
    );
  }

  findCommentsOfPost(id: string): Observable<Comment[]> {
    return from(this.commentRepository.findByPostId(id)).pipe(
      map((e, idx) =>
        e.map((c) => {
          return { id: c.id, content: c.content } as Comment;
        }),
      ),
    );
  }

  addComment(id: string, comment: string): Observable<Comment> {
    return from(
      this.commentRepository.save({
        content: comment,
        post: { id: id } as PostEntity,
      }),
    ).pipe(
      map((c, idx) => {
        return { id: c.id, content: c.content } as Comment;
      }),
    );
  }

  private mapAsModel(e: PostEntity): Post {
    return {
      id: e.id,
      title: e.title,
      content: e.content,
    };
  }

  private mapAsModelArray(entities: PostEntity[]): Post[] {
    return entities.map((e) => {
      return {
        id: e.id,
        title: e.title,
        content: e.content,
      };
    });
  }
}
