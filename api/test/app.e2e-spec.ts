import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http.exception.filter';
import { Post } from 'src/gql/types/post.model';
const gql = '/graphql';

describe('application (e2e)', () => {
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

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

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
            query: `mutation($createPostInput:PostInput!){
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
        console.log('res: ', JSON.stringify(res.body));
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.errors[0].message).toBe('Unauthorized');
      });
    });

    describe('posts operations(with token)', () => {
      const token =
        process.env.TOKEN ||
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlYzM1lvNzk5cC1XeFI2NHpJZ29QMyJ9.eyJpc3MiOiJodHRwczovL2Rldi1lc2U4MjQxYi51cy5hdXRoMC5jb20vIiwic3ViIjoiSUVYVjJNYkFpdUVrVjBKN3VmSDBCcXEyYTJZSUYzaDFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaGFudHN5LmdpdGh1Yi5pby9hcGkiLCJpYXQiOjE2MjkxODQ5MTksImV4cCI6MTYyOTI3MTMxOSwiYXpwIjoiSUVYVjJNYkFpdUVrVjBKN3VmSDBCcXEyYTJZSUYzaDEiLCJzY29wZSI6InJlYWQ6cG9zdHMgd3JpdGU6cG9zdHMgZGVsZXRlOnBvc3RzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwicGVybWlzc2lvbnMiOlsicmVhZDpwb3N0cyIsIndyaXRlOnBvc3RzIiwiZGVsZXRlOnBvc3RzIl19.VbaJysKCEpQusjrfv03kIZPeYJJf2U7DgQhY-_AH3yBXaMWv40h2mm4Vw-4tgtyqBJt8DbDFtuL6XMf4xjusoDgMuHsbz9N1Kh7J_O1ONznm7DFoPEP_dh4JY7hghzjxQFFlR3PIMNEmO6nJ8Nnm6XglfafunasQyMZHfZ2mRfe-1x0LykmyGwFbcI7r4HWJ2h02vOFuFAHkq0lzJZ-i48zjYuQ2VS79vSkQNk-fe28Next7Iq7IOpGUqpn6nvL5upiYPTWknh8yrP2P5EFpAy9gRQeTRwM-H67kbZq0jX5RzXEGKLqP6Y5rss0PV6dDfqivL1Od4zUE11AMkVqUuA';
      beforeAll(() => {
        console.log('token:', token);
      });

      it('mutation createPost', async () => {
        //sync user data to users
        const updateUserRes = await request(app.getHttpServer())
          .post(gql)
          .set('authorization', 'Bearer ' + token)
          .send({
            query: `mutation{
              updateUser{
                success
              }
            }`,
          });
        console.log('updateUser data:', JSON.stringify(updateUserRes.body));
        expect(updateUserRes.body.data.updateUser.success).toBeTruthy();

        const res = await request(app.getHttpServer())
          .post(gql)
          .set('authorization', 'Bearer ' + token)
          .send({
            query: `mutation($createPostInput:PostInput!){
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
        console.log('createPost errors:', JSON.stringify(res.body.errors));
        const postId = (res.body.data.createPost as Post).id;
        console.log('created post id:', postId);
        expect(res.status).toBe(200);
        expect(postId).not.toBeNull();

        const cres = await request(app.getHttpServer())
          .post(gql)
          .set('authorization', 'Bearer ' + token)
          .send({
            query: `mutation addCommentToPost($commentInput:CommentInput!){
              addComment(commentInput:$commentInput){
                 id
                 content
                }
              }`,
            variables: {
              commentInput: {
                postId: postId,
                content: 'test comment of our title',
              },
            },
          });

        console.log('addComment data:', JSON.stringify(cres.body.data));
        console.log('addComment errors:', JSON.stringify(cres.body.errors));
        const cid = cres.body.data.addComment.id;
        expect(cres.status).toBe(200);
        expect(cid).not.toBeNull();

        const pres = await request(app.getHttpServer())
          .post(gql)
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
