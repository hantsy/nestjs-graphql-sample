# Getting Started

## Prerequisites

- Node.js 24+
- Docker (for MongoDB)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/hantsy/nestjs-graphql-sample.git
cd nestjs-graphql-sample
```

### 2. Install dependencies

This is an Nx monorepo with npm workspaces — all dependencies are installed from the root:

```bash
npm install
```

### 3. Start MongoDB

```bash
docker compose up -d
```

### 4. Set up the server

Configure environment (optional — defaults work out of the box):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MONGODB_URI` | `mongodb://localhost/blog` | MongoDB connection string |
| `SEED_DATABASE` | (unset) | Set to `true` to seed sample data |

Start the development server:

```bash
npx nx serve nestjs-graphql-server
```

Visit `http://localhost:3000/graphql` to open Apollo Sandbox.

### 5. Set up the client

In a new terminal:

```bash
npx nx serve client
```

Visit `http://localhost:4200` to view the Angular application.

### 6. Seed sample data (optional)

Stop the server, then restart with:

```bash
SEED_DATABASE=true npx nx serve nestjs-graphql-server
```

This creates 3 sample posts with comments.

## Nx Commands

| Command | Description |
|---------|-------------|
| `nx build client` | Production build (Angular) |
| `nx build nestjs-graphql-server` | Production build (NestJS) |
| `nx test client` | Run Vitest unit tests |
| `nx test nestjs-graphql-server` | Run Jest unit tests |
| `nx run-many -t build` | Build both projects in parallel |
| `nx affected -t test` | Test only projects changed since master |
| `nx graph` | Show project dependency graph |

## Running with Docker

The server and client each have their own Dockerfile. Build from the repository root:

```bash
# Server
docker build -f apps/server/Dockerfile -t blog-server .

# Client
docker build -f apps/client/Dockerfile -t blog-client .
```
