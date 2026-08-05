import { ApplicationConfig, provideZonelessChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
      };
    }),
  ],
};
