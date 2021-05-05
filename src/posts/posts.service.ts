import { Injectable } from '@nestjs/common';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  forAuthor(id: number): Post[] {
    throw new Error('Method not implemented.');
  }

  addComment(id: number, comment: string): Comment {
    throw new Error('Method not implemented.');
  }
  upvoteById(id: number) {
    throw new Error('Method not implemented.');
  }

  findAll(): Post[] {
    throw new Error('Method not implemented.');
  }
}
