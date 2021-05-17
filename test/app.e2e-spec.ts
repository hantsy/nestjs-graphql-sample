import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // GraphQL endpoints
  describe(gql, () => {
    describe('posts ', () => {
      it('should get all posts', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({ query: '{getAllPosts {id title content }}' });

        expect(res.status).toBe(200);
        expect(res.body.data.getAllPosts.length).toEqual(4);
      });
    });

    describe('should create post', () => {
      it('should get all posts', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query:
              'mutation($createPostInput:CreatePostInput!){createPost(createPostInput:$createPostInput){ id, title }}',
            variables: {
              createPostInput: {
                title: 'test title',
                content: 'test content of our title',
              },
            },
          });

        expect(res.status).toBe(200);
        expect(res.body.data.id).not.toBeNull();
      });
    });
  });
});
