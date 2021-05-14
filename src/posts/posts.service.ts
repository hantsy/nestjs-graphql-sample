import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  createPost(data: CreatePostInput) {
    throw new Error('Method not implemented.');
  }

  findByAuthor(id: string): Promise<Post[]> {
    throw new Error('Method not implemented.');
  }

  addComment(id: string, comment: string): Promise<Comment> {
    throw new Error('Method not implemented.');
  }

  upvoteById(id: string): Promise<Post> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<Post> {
    throw new Error('Method not implemented.');
  }

  findAll(args: { q: string; offset: number; limit: number }): Promise<Post[]> {
    throw new Error('Method not implemented.');
  }
}
