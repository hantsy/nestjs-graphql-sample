import { NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

const uri = environment.baseApiUrl; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink, authService: AuthService) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext(async (operation, context) => {
    const token = await authService.getAccessTokenSilently().toPromise();

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AuthService],
    },
  ],
})
export class GraphQLModule {}
