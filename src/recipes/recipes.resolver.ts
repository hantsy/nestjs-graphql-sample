import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '../common/base.resolver';
import { Recipe } from './models/recipe.model';
import { RecipesService } from './recipes.service';

@Resolver((of) => Recipe)
export class RecipesResolver extends BaseResolver(Recipe) {
  constructor(private recipesService: RecipesService) {
    super();
  }

  // @Query({
  //   complexity: (options: ComplexityEstimatorArgs) =>
  //     options.args.count * options.childComplexity,
  // })
  // items(@Args('count') count: number) {
  //   return this.itemsService.getItems({ count });
  // }
}
