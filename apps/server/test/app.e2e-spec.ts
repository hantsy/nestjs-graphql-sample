import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('query posts', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{ posts { id title content createdAt } }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.posts).toBeDefined();
        expect(Array.isArray(res.body.data.posts)).toBe(true);
      });
  });

  it('create and query a post', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createPost(input: { title: "E2E Test", content: "This is an e2e test post content." }) {
              id
              title
              content
            }
          }
        `,
      })
      .expect(200);

    const { id, title } = createRes.body.data.createPost;
    expect(title).toBe('E2E Test');

    const getRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{ post(id: "${id}") { id title content } }`,
      })
      .expect(200);

    expect(getRes.body.data.post.title).toBe('E2E Test');
  });
});
