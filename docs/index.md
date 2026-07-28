# NestJS GraphQL Blog Sample

A modern blog application demonstrating how to build a GraphQL API with NestJS and MongoDB, paired with an Angular frontend using Apollo Angular.

## Tech Stack

### Backend (server/)

- **NestJS 11** — Progressive Node.js framework
- **GraphQL** — Code-first approach with `@nestjs/graphql`
- **MongoDB** — Via `@nestjs/mongoose` (built-in NestJS integration)
- **Apollo Server 5** — GraphQL server engine

### Frontend (client/)

- **Angular 22** — Standalone components, signals, `@if`/`@for` control flow
- **Angular Material** — UI component library
- **Apollo Angular** — GraphQL client

### Infrastructure

- **Docker Compose** — MongoDB 8 service
- **Multi-stage Dockerfiles** — Optimized production images
- **GitHub Actions** — 6 CI/CD workflows (build, e2e, mkdocs, stale, greetings, dependabot-automerge)

## Quick Start

```bash
# Start MongoDB
docker compose up -d

# Start the server (http://localhost:3000/graphql)
cd server && npm install && npm run start:dev

# Start the client (http://localhost:4200)
cd client && npm install --legacy-peer-deps && npm start
```

## GraphQL API

The GraphQL endpoint is at `http://localhost:3000/graphql` with Apollo Sandbox for interactive exploration.

### Queries

- `posts(keyword, skip, take)` — Paginated post list with optional search
- `post(id)` — Single post with comments
- `postCount(keyword)` — Total post count

### Mutations

- `createPost(input)` — Create a new post
- `updatePost(id, input)` — Update a post
- `deletePost(id)` — Delete a post and its comments
- `addComment(input)` — Add a comment to a post
