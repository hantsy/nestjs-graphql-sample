# NestJS GraphQL Blog Sample

A modern blog application built with **NestJS 11**, **GraphQL** (code-first), and **MongoDB** on the backend, and **Angular 22** with **Apollo Angular**, **Angular Material**, and **signals** on the frontend — all managed as an **Nx monorepo** with npm workspaces.

## Project Structure

```
nestjs-graphql-sample/
├── apps/
│   ├── server/              # NestJS 11 GraphQL API
│   │   ├── src/
│   │   │   ├── post/        # Posts + Comments module
│   │   │   ├── common/      # Scalars, filters
│   │   │   └── config/      # Configuration
│   │   ├── Dockerfile
│   │   └── package.json
│   └── client/              # Angular 22 frontend
│       ├── src/app/
│       │   ├── home/        # Home page
│       │   ├── posts/       # Post components
│       │   └── *.ts         # Config, routes, theme service
│       ├── Dockerfile
│       └── package.json
├── libs/                    # Shared libraries (future)
├── nx.json                  # Nx workspace config
├── package.json             # Root manifest (npm workspaces)
├── tsconfig.base.json       # Shared TypeScript config
├── docker-compose.yml       # MongoDB 8
├── docs/                    # MkDocs documentation
├── .github/workflows/       # CI/CD pipelines
└── mkdocs.yml
```

## Quick Start

This is an Nx monorepo — dependencies are installed once at the root via npm workspaces:

```bash
# Install all dependencies (both apps)
npm install

# Start MongoDB
docker compose up -d

# Start the GraphQL server (http://localhost:3000/graphql)
npx nx serve nestjs-graphql-server

# Start the Angular client (http://localhost:4200) — new terminal
npx nx serve client
```

### Useful Nx Commands

| Command | Purpose |
|---|---|
| `nx build client` | Production build (Angular) |
| `nx build nestjs-graphql-server` | Production build (NestJS) |
| `nx test client` | Run Vitest tests |
| `nx test nestjs-graphql-server` | Run Jest tests |
| `nx run-many -t build` | Build all projects in parallel |
| `nx affected -t test --base=origin/master` | Test only changed projects |
| `nx graph` | Visualize dependency graph |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Nx with npm workspaces |
| Backend framework | NestJS 11 |
| API protocol | GraphQL (code-first) |
| Database | MongoDB via `@nestjs/mongoose` |
| GraphQL server | Apollo Server 5 |
| Frontend framework | Angular 22 |
| UI library | Angular Material (custom "Indigo Studio" theme) |
| GraphQL client | Apollo Angular |
| State management | Angular Signals |
| Styling | Sass with CSS custom properties, dark/light mode |
| Testing (server) | Jest |
| Testing (client) | Vitest |
| Documentation | MkDocs Material |

## Design

The client features a custom **"Indigo Studio"** theme built on Angular Material with:

- **Indigo primary / violet accent** color palette
- **Dark/light mode** toggle with `prefers-color-scheme` detection
- Skeleton loading states, gradient accent bars, consistent button placement
- CSS custom properties for all design tokens

See `docs/superpowers/specs/2026-08-05-client-ui-redesign.md` for the full design specification.

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
