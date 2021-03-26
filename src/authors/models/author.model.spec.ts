import { Author } from './author.model';

describe('AuthorModel', () => {
  it('should be defined', () => {
    expect(new Author()).toBeDefined();
  });
});
