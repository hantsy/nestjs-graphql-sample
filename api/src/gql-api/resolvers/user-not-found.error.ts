import { ApolloError } from 'apollo-server-errors';
export class UserNotFoundError extends ApolloError {
  postId: string;
  constructor(id: string) {
    super('User:' + id + ' was not found', 'POST_NOT_FOUND');
    this.postId = id;
  }
}
