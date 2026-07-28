# Reimplementing a NestJS Blog API with Modern GraphQL and MongoDB

**Published: July 28, 2026 | Author: Hantsy Bai**

---

## Introduction

This post documents the complete reimplementation of the [nestjs-graphql-sample](https://github.com/hantsy/nestjs-graphql-sample) project — a blog application that has undergone a significant modernization from a legacy NestJS 8 stack with TypeORM and PostgreSQL to a cutting-edge NestJS 11 architecture with GraphQL, MongoDB, and a modern Angular frontend.

The reimplementation took inspiration from the companion project [nestjs-sample](https://github.com/hantsy/nestjs-sample), a REST API built with NestJS 11, carrying forward its MongoDB integration patterns and CI/CD infrastructure while replacing the REST layer with GraphQL and removing authentication entirely to focus on the core blogging domain.

## Motivation: Why Rebuild?

The original project was built in 2021 and had several architectural choices that no longer reflected best practices:

| Before | After |
|--------|-------|
| NestJS 8 | NestJS 11 |
| TypeORM + PostgreSQL | Mongoose + MongoDB via `@nestjs/mongoose` |
| REST endpoints | GraphQL (code-first) |
| Apollo Server 3 | Apollo Server 5 |
| Auth0 + Passport JWT | No authentication (public API) |
| Custom Logger module | NestJS built-in Logger |
| RxJS Observables in services | Promise / async-await |
| Angular 12 with NgModules | Angular 22 standalone + signals |
| 2 CI workflows | 6 CI workflows |
| No backend Dockerfile | Multi-stage Dockerfiles for both server and client |

## Backend: NestJS 11 with Code-First GraphQL

### GraphQL Schema Design

The code-first approach uses decorators to define the GraphQL schema directly from TypeScript classes, with the SDL auto-generated into `schema.gql`:

```typescript
// post.type.ts — @ObjectType defines GraphQL types
@ObjectType('Post')
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [CommentType], { nullable: 'items' })
  comments?: CommentType[];
}

// post.input.ts — @InputType defines mutation inputs
@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  @MinLength(10)
  content: string;
}
```

### Schema-First vs Code-First

We chose the **code-first** approach because:

- **Type safety**: TypeScript classes serve as the single source of truth
- **DRY**: No need to maintain separate `.graphql` files and TypeScript types
- **Decorator-driven**: NestJS's idiom of decorators carries through cleanly
- **Auto-generated SDL**: The schema file is generated automatically, useful for client-side code generation

### MongoDB Integration with @nestjs/mongoose

One of the biggest improvements was switching from a custom Mongoose provider pattern to NestJS's built-in `@nestjs/mongoose` module. The reference project used custom providers with string tokens:

```typescript
// Before (nestjs-sample): custom provider pattern
import { createConnection } from 'mongoose';
const databaseConnectionProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (config) => createConnection(config.uri),
  },
];

// After (this project): @nestjs/mongoose decorators
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;
}

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
})
export class PostModule {}
```

The built-in module reduces boilerplate, provides standard decorators (`@Schema`, `@Prop`), and integrates naturally with NestJS's dependency injection — inject models via `@InjectModel(Post.name)`.

### Logger: From Custom to Built-in

The reference project had an elaborate custom `LoggerModule` with a prefix-collection pattern, transient-scoped `LoggerService`, and a custom `@Logger()` decorator. In the reimplementation, we simply use NestJS's built-in `Logger`:

```typescript
// Simple, effective, no custom module needed
@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
}
```

### RxJS to Async/Await

The reference project used RxJS `Observable` throughout services — `from()`, `pipe()`, `mergeMap()`, `throwIfEmpty()`. Modern NestJS convention favors `Promise` / `async-await`, which is simpler and easier to test:

```typescript
// Before: RxJS Observable
findById(id: string): Observable<Post> {
  return from(this.postModel.findById(id).exec()).pipe(
    mergeMap((post) =>
      post ? of(post) : throwError(() => new NotFoundException()),
    ),
  );
}

// After: simple async/await
async findById(id: string): Promise<PostDocument> {
  const post = await this.postModel.findById(id).exec();
  if (!post) throw new NotFoundException(`Post with id "${id}" not found`);
  return post;
}
```

## Frontend: Angular 22 with Singals and Standalone APIs

### Standalone Components

No more `@NgModule` boilerplate. Every component is standalone with its dependencies declared inline:

```typescript
@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  template: `...`,
})
export class HomeComponent {}
```

### Lazy-Loaded Routes

Routes use the modern `loadComponent` pattern for code-splitting:

```typescript
export const routes: Routes = [
  {
    path: 'posts',
    loadComponent: () =>
      import('./posts/post-list').then((m) => m.PostListComponent),
  },
];
```

### Signals for State

Angular's reactive primitive replaces manual subscriptions:

```typescript
posts = signal<Post[]>([]);
loading = signal(true);

loadPosts() {
  this.loading.set(true);
  this.postService.getPosts().subscribe(({ data }) => {
    this.posts.set(data.posts);
    this.loading.set(false);
  });
}
```

### New Control Flow

Angular's `@if`/`@for`/`@else` template syntax replaces `*ngIf`/`*ngFor`:

```html
@if (loading()) {
  <p>Loading...</p>
} @else {
  @for (post of posts(); track post.id) {
    <h2>{{ post.title }}</h2>
  } @empty {
    <p>No posts found.</p>
  }
}
```

### Apollo Angular

GraphQL communication is handled by Apollo Angular with `provideApollo()`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
      };
    }),
  ],
};
```

## No Authentication

A deliberate simplification — the original project had Auth0 JWT authentication with permission-based guards (`read:posts`, `write:posts`). The reimplementation removes all authentication, making this a purely public blog API. This dramatically reduces code complexity:

- No `AuthModule`, `UserModule`, `JwtStrategy`, `LocalStrategy`
- No guards, decorators, or role checks
- No `createdBy`/`updatedBy` fields on entities
- Simplified service methods without request-scoped injection

## CI/CD Infrastructure

The CI/CD pipeline was expanded from 2 workflows to 6, adapted from the `nestjs-sample` project:

| Workflow | Purpose |
|----------|---------|
| `build.yml` | Build + test both `server/` and `client/` |
| `e2e.yml` | End-to-end tests with MongoDB |
| `mkdocs.yml` | Deploy documentation to GitHub Pages |
| `stale.yml` | Auto-manage stale issues and PRs |
| `greetings.yml` | Welcome first-time contributors |
| `dependabot-automerge.yml` | Auto-merge Dependabot PRs |

## Docker

Both the server and client now have multi-stage Dockerfiles:

- **Server**: `node:24-alpine` build → production with non-root user and healthcheck
- **Client**: `node:24-alpine` build (Angular) → `nginx:alpine` serving static files with GraphQL proxy

MongoDB is managed via `docker-compose.yml` (single `mongo:8` service with named volume).

## Conclusion

The reimplementation brings the codebase up to date with the latest NestJS and Angular conventions while simplifying the architecture considerably. Key takeaways:

1. **Use built-in modules**: `@nestjs/mongoose` and NestJS `Logger` eliminate custom boilerplate
2. **Promise over RxJS**: Simpler, more idiomatic TypeScript for CRUD services
3. **Code-first GraphQL**: Type-safe, DRY, well-integrated with NestJS decorators
4. **Standalone + Signals**: The modern Angular way — less code, clearer intent
5. **Simplify aggressively**: Removing auth eliminated entire modules with zero loss of core functionality

The source code is available at [github.com/hantsy/nestjs-graphql-sample](https://github.com/hantsy/nestjs-graphql-sample).
