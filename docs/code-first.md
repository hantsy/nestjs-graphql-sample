# Code  First 

```bash
$ npm i @nestjs/graphql graphql-tools graphql apollo-server-express
```

> If using Fastify, instead of installing `apollo-server-express`, you should install `apollo-server-fastify`.

// create module post, common

```bash
nest g mo posts
nest g mo common

nest g class posts/post.model
nest g class posts/comment.model

nest g mo authors
nest g class authors/author.model

nest g service posts/posts --flat
nest g service  authors/authors --flat
```

