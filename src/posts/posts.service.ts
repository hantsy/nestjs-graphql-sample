import { Injectable } from '@nestjs/common';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  forAuthor(id: number): Post[] {
    throw new Error('Method not implemented.');
  }
  addComment(arg0: { id: number; comment: any }) {
    throw new Error('Method not implemented.');
  }
  upvoteById(arg0: { id: number }) {
    throw new Error('Method not implemented.');
  }
  findAll(arg0: { authorId: number }) {
    throw new Error('Method not implemented.');
  }
}
