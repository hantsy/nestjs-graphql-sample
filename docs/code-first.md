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

$ curl http://localhost:3000/graphql \
 -H "Content-Type:application/json" \
 -X POST \
 -d '{"query": "{getAllPosts{id title content}}" }'
> {"data":{"getAllPosts":[{"id":"c4a9830e-4544-4f4b-9b9a-56c767487a92","title":"GENERATE A NESTJS PROJECT","content":"content"},{"id":"79fae7e0-1f34-473f-9d5d-6a538924d478","title":"CREATE GRAPQL APIS","content":"content"},{"id":"8c1f7996-fbfc-4285-a99f-b791c03e187d","title":"CONNECT TO POSTGRES VIA TYPEORM","content":"content"},{"id":"783b7f83-f8d4-46a8-9628-8ed41e0037be","title":"TEST TITLE","content":"test content"}]}}



$ curl http://localhost:3000/graphql -H "Content-Type:application/json" -X POST -d '{"query": "{getAllPosts{id title content, comments{ content }}}" }'
{"data":{"getAllPosts":[{"id":"c4a9830e-4544-4f4b-9b9a-56c767487a92","title":"GENERATE A NESTJS PROJECT","content":"content","comments":[]},{"id":"79fae7e0-1f34-473f-9d5d-6a538924d478","title":"CREATE GRAPQL APIS","content":"content","comments":[]},{"id":"8c1f7996-fbfc-4285-a99f-b791c03e187d","title":"CONNECT TO POSTGRES VIA TYPEORM","content":"content","comments":[]},{"id":"783b7f83-f8d4-46a8-9628-8ed41e0037be","title":"TEST TITLE","content":"test content","comments":[{"content":"test comment"}]}]}}

$ curl http://localhost:3000/graphql \
> -H "Content-Type:application/json" \
> -X POST \
> -d '{
>  "query": "mutation($createPostInput:CreatePostInput!){createPost(createPostInput:$createPostInput){ id, title }}",
>  "variables": {
>    "createPostInput": {
>      "title": "test title",
>      "content": "test content of our title"
>    }
>  }
> }'
> {"data":{"createPost":{"id":"b5847f62-2917-44ae-8891-cf6f06505565","title":"TEST TITLE"}}}
