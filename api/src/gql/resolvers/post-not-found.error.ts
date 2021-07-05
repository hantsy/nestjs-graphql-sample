import { ApolloError } from 'apollo-server-errors';
export class PostNotFoundError extends ApolloError {
  postId: string;
  constructor(id: string) {
    super('Post:' + id + ' was not found', 'POST_NOT_FOUND');
    this.postId = id;
  }
}
