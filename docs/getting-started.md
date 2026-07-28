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

### 2. Start MongoDB

```bash
docker compose up -d
```

### 3. Set up the server

```bash
cd server
npm install
```

Configure environment (optional — defaults work out of the box):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MONGODB_URI` | `mongodb://localhost/blog` | MongoDB connection string |
| `SEED_DATABASE` | (unset) | Set to `true` to seed sample data |

Start the development server:

```bash
npm run start:dev
```

Visit `http://localhost:3000/graphql` to open Apollo Sandbox.

### 4. Set up the client

```bash
cd ../client
npm install --legacy-peer-deps
npm start
```

Visit `http://localhost:4200` to view the Angular application.

### 5. Seed sample data (optional)

Stop the server, then restart with:

```bash
SEED_DATABASE=true npm run start:dev
```

This creates 3 sample posts with comments.
