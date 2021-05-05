import { Post } from './post.model';

describe('PostModel', () => {
  it('should be defined', () => {
    expect(new Post()).toBeDefined();
  });
});
