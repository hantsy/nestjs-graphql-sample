# NestJS GraphQL Blog Sample

A modern blog application demonstrating how to build a GraphQL API with NestJS and MongoDB, paired with an Angular frontend using Apollo Angular — all managed as an **Nx monorepo**.

## Tech Stack

### Monorepo

- **Nx** — Build system with task caching, affected commands, and dependency graph
- **npm workspaces** — Hoisted dependency management via root `package.json`

### Backend (apps/server/)

- **NestJS 11** — Progressive Node.js framework
- **GraphQL** — Code-first approach with `@nestjs/graphql`
- **MongoDB** — Via `@nestjs/mongoose` (built-in NestJS integration)
- **Apollo Server 5** — GraphQL server engine
- **Testing** — Jest unit tests + supertest E2E tests

### Frontend (apps/client/)

- **Angular 22** — Standalone components, signals, `@if`/`@for` control flow
- **Angular Material** — Custom "Indigo Studio" theme (indigo primary, violet accent)
- **Apollo Angular** — GraphQL client
- **Dark/light mode** — Signal-based theme service with CSS custom properties
- **Testing** — Vitest

### Infrastructure

- **Docker Compose** — MongoDB 8 service
- **Multi-stage Dockerfiles** — Optimized production images
- **GitHub Actions** — CI/CD workflows (build, e2e, mkdocs, stale, greetings, dependabot-automerge)

## Quick Start

```bash
# Install all dependencies (root-level npm workspaces)
npm install

# Start MongoDB
docker compose up -d

# Start the server (http://localhost:3000/graphql)
npx nx serve nestjs-graphql-server

# Start the client (http://localhost:4200)
npx nx serve client
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
