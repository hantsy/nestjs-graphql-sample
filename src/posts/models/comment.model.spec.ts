import { Comment } from './comment.model';

describe('CommentModel', () => {
  it('should be defined', () => {
    expect(new Comment()).toBeDefined();
  });
});
