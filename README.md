# NestJS GraphQL Sample

![frontend](https://github.com/hantsy/nestjs-graphql-sample/workflows/frontend/badge.svg)
![backend](https://github.com/hantsy/nestjs-graphql-sample/workflows/backend/badge.svg)
[![codecov](https://codecov.io/gh/hantsy/nestjs-graphql-sample/branch/master/graph/badge.svg)](https://codecov.io/gh/hantsy/nestjs-graphql-sample)

A NestJS GraphQL sample project, including:

* Code first Nestjs/GraphQl development
* TypeORM with Postgres 
* Passport/Jwt authentication with auth0.net IDP service
* Fully testing codes with Jest, jest-mock-extended, ts-mockito, etc.
* Github actions for continuous testing, code coverage report, docker image building, etc.

## Docs




## Build
### Install dependencies

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources
* [NestJS GraphQL chapter](https://docs.nestjs.com/graphql/quick-start)
* [The Anatomy of a GraphQL Query](https://www.apollographql.com/blog/the-anatomy-of-a-graphql-query-6dffa9e9e747/)
* [Developing a Secure API with NestJS: Managing Identity](https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/)
* [Developing a Secure API with NestJS: Managing Roles](https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-role-based-access-control/)
