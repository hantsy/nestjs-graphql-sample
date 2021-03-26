import { Recipe } from './recipe.model';

describe('RecipeModel', () => {
  it('should be defined', () => {
    expect(new Recipe()).toBeDefined();
  });
});
