import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http.exception.filter';
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
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlYzM1lvNzk5cC1XeFI2NHpJZ29QMyJ9.eyJpc3MiOiJodHRwczovL2Rldi1lc2U4MjQxYi51cy5hdXRoMC5jb20vIiwic3ViIjoiSUVYVjJNYkFpdUVrVjBKN3VmSDBCcXEyYTJZSUYzaDFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaGFudHN5LmdpdGh1Yi5pby9hcGkiLCJpYXQiOjE2MjIyODMxNDEsImV4cCI6MTYyMjM2OTU0MSwiYXpwIjoiSUVYVjJNYkFpdUVrVjBKN3VmSDBCcXEyYTJZSUYzaDEiLCJzY29wZSI6InJlYWQ6cG9zdHMgd3JpdGU6cG9zdHMgZGVsZXRlOnBvc3RzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwicGVybWlzc2lvbnMiOlsicmVhZDpwb3N0cyIsIndyaXRlOnBvc3RzIiwiZGVsZXRlOnBvc3RzIl19.NRYnpuLQBI8KvZSfrqyy9IKctCdaNoKMZzZ6iIXKZmqfM_IYcR90YKGqW7Xx3R2_EPWkWpH0i8deM0-GV0FTZUFZO0YYs3upWe1M9_GdQouyeADueFUd_XbE9esoR3AWdq7Iu9BmqafA8t66kXdupKh7ADMkuK_mhF5sD7M0FY9HvH1kbWQBvhWLbSlHPWsfQFldJ7wKJKyKY1lSooXnHfVMthrdLi5KlTt06TQ-GOXD1wC9GW9G9wiiV2NJeZrVJ4mNjsK5kCve5ImESHGSI3hZh8e8E0-K4dY5NsFjKttu7mEdtznm30U7iISxFjfFzucClDj3OnjxuzzEIw1kYQ';

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
        console.log('updateUserRes data:', JSON.stringify(updateUserRes.body));
        expect(updateUserRes.body.data.success).toBeTruthy();

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
        const postId = res.body.data.createPost.id;
        expect(res.status).toBe(200);
        expect(postId).not.toBeNull();

        const cres = await request(app.getHttpServer())
          .post(gql)
          .set('authorization', 'Bearer ' + token)
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
