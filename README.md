# NestJS GraphQL Blog Sample

A modern blog application built with **NestJS 11**, **GraphQL** (code-first), and **MongoDB** on the backend, and **Angular 22** with **Apollo Angular**, **Angular Material**, and **signals** on the frontend.

## Project Structure

```
nestjs-graphql-sample/
├── server/              # NestJS 11 GraphQL API
│   ├── src/
│   │   ├── post/        # Posts + Comments module
│   │   ├── common/      # Scalars, filters
│   │   └── config/      # Configuration
│   ├── Dockerfile
│   └── package.json
├── client/              # Angular 22 frontend
│   ├── src/app/
│   │   ├── home/        # Home page
│   │   ├── posts/       # Post components
│   │   └── graphql/     # Apollo setup
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # MongoDB 8
├── docs/                # MkDocs documentation
├── .github/workflows/   # CI/CD pipelines
└── mkdocs.yml
```

## Quick Start

```bash
# Start MongoDB
docker compose up -d

# Start the GraphQL server
cd server
npm install
npm run start:dev

# Start the Angular client (new terminal)
cd client
npm install --legacy-peer-deps
npm start
```

- **GraphQL Playground**: http://localhost:3000/graphql
- **Angular App**: http://localhost:4200

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend framework | NestJS 11 |
| API protocol | GraphQL (code-first) |
| Database | MongoDB via `@nestjs/mongoose` |
| GraphQL server | Apollo Server 5 |
| Frontend framework | Angular 22 |
| UI library | Angular Material |
| GraphQL client | Apollo Angular |
| State management | Angular Signals |
| CI/CD | GitHub Actions (6 workflows) |
| Documentation | MkDocs Material |

## GraphQL API

### Queries

| Query | Arguments | Returns |
|-------|-----------|---------|
| `posts` | `keyword`, `skip`, `take` | `[Post!]!` |
| `post` | `id: ID!` | `Post` |
| `postCount` | `keyword` | `Int!` |

### Mutations

| Mutation | Input | Returns |
|----------|-------|---------|
| `createPost` | `CreatePostInput!` | `Post!` |
| `updatePost` | `id: String!, UpdatePostInput!` | `Post!` |
| `deletePost` | `id: String!` | `Boolean!` |
| `addComment` | `CreateCommentInput!` | `Comment!` |

## License

[GPLv3](LICENSE)
