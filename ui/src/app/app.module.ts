import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import the module from the SDK
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { GraphQLModule } from './core/graphql.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-ese8241b.us.auth0.com',
      clientId: 'xwulkQN219vK2LU9MKowCo0HQLRi0WQU',
      audience: 'https://hantsy.github.io/api',
      scope: 'openid profile email read:posts write:posts',
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          // Attach access tokens to any calls to '/api' (exact match)
          //'/api',
          // Attach access tokens to any calls that start with '/api/'
          '/graphql/*',
          // Match anything starting with /api/posts, but also specify the audience and scope the attached
          // access token must have
          // {
          //   uri: '/api/posts/*',
          //   httpMethod: 'get',
          //   tokenOptions: {
          //     audience: 'https://hantsy.github.io/api',
          //     scope: 'read:posts',
          //   },
          // },
          // {
          //   uri: '/api/posts/*',
          //   httpMethod: 'post',
          //   tokenOptions: {
          //     audience: 'https://hantsy.github.io/api',
          //     scope: 'write:posts',
          //   },
          // },
          // {
          //   uri: '/api/posts/*',
          //   httpMethod: 'put',
          //   tokenOptions: {
          //     audience: 'https://hantsy.github.io/api',
          //     scope: 'write:posts',
          //   },
          // },
          // {
          //   uri: '/api/posts/*',
          //   httpMethod: 'delete',
          //   tokenOptions: {
          //     audience: 'https://hantsy.github.io/api',
          //     scope: 'delete:posts',
          //   },
          // },
          // // Using an absolute URI
          // {
          //   uri: 'https://dev-ese8241b.us.auth0.com/api/v2/users',
          //   tokenOptions: {
          //     audience: 'https://hantsy.github.io/api',
          //     scope: 'read:users',
          //   },
          // },
        ],
      },
    }),
    HomeModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
