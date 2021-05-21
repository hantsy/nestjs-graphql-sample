import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http.exception.filter';
const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
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
    describe('posts operations(without token) ', () => {
      it('query getAllPosts', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: `query{
            getAllPosts{
              id
              title
              content
            }
          }`,
          });

        expect(res.status).toBe(200);
        expect(res.body.data.getAllPosts.length).toEqual(4);
      });

      it('mutation createPost', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: `mutation($createPostInput:CreatePostInput!){
          createPost(createPostInput:$createPostInput){
             id
             title
            }
          }`,
            variables: {
              createPostInput: {
                title: 'test title',
                content: 'test content of our title',
              },
            },
          });

        expect(res.status).toBe(401);
      });
    });

    describe('posts operations(with token)', () => {
      const token = process.env.TOKEN;

      it('mutation createPost', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .set('Authorization', 'Bearer ' + token)
          .send({
            query: `mutation($createPostInput:CreatePostInput!){
              createPost(createPostInput:$createPostInput){
                 id
                 title
                }
              }`,
            variables: {
              createPostInput: {
                title: 'test title',
                content: 'test content of our title',
              },
            },
          });
        console.log('createPost data:', JSON.stringify(res.body.data));
        const postId = res.body.data.createPost.id;
        expect(res.status).toBe(200);
        expect(postId).not.toBeNull();

        const cres = await request(app.getHttpServer())
          .post(gql)
          .set('Authorization', 'Bearer ' + token)
          .send({
            query: `mutation($commentInput:CommentInput!){
              addComment(commentInput:$commentInput){
                 id
                 content
                }
              }`,
            variables: {
              commentInput: {
                postId: postId,
                content: 'test content of our title',
              },
            },
          });

        console.log('addComment data:', JSON.stringify(cres.body.data));
        const cid = cres.body.data.addComment.id;
        expect(cres.status).toBe(200);
        expect(cid).not.toBeNull();

        const pres = await request(app.getHttpServer())
          .post(gql)
          .set('Authorization', 'Bearer ' + token)
          .send({
            query: `query($id:String!) {
              getPostById(postId: $id) {
                id
                title
                content
                comments{
                  id
                }
              }
            }`,
            variables: {
              id: postId,
            },
          });

        console.log('getPostById data:', JSON.stringify(pres.body.data));
        expect(pres.status).toBe(200);
        expect(pres.body.data.getPostById.comments[0].id).toEqual(cid);
      });
    });
  });
});
