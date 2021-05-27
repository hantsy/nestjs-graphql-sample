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
        console.log('res: ', JSON.stringify(res.body));
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.errors[0].message).toBe('Unauthorized');
      });
    });

    describe('posts operations(with token)', () => {
      const token =
        process.env.TOKEN ||
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlYzM1lvNzk5cC1XeFI2NHpJZ29QMyJ9.eyJpc3MiOiJodHRwczovL2Rldi1lc2U4MjQxYi51cy5hdXRoMC5jb20vIiwic3ViIjoiSUVYVjJNYkFpdUVrVjBKN3VmSDBCcXEyYTJZSUYzaDFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaGFudHN5LmdpdGh1Yi5pby9hcGkiLCJpYXQiOjE2MjE2NjI4NjAsImV4cCI6MTYyMTc0OTI2MCwiYXpwIjoiSUVYVjJNYkFpdUVrVjBKN3VmSDBCcXEyYTJZSUYzaDEiLCJzY29wZSI6InJlYWQ6cG9zdHMgd3JpdGU6cG9zdHMgZGVsZXRlOnBvc3RzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwicGVybWlzc2lvbnMiOlsicmVhZDpwb3N0cyIsIndyaXRlOnBvc3RzIiwiZGVsZXRlOnBvc3RzIl19.VXwxVYKjyJ65F3phGs8D7L8vtZbJKNSKjO40L0yuF_LhA24CUOT29EYub3OedmRmMLPCrM829t3LH5UnQw8u3vpLx3TEOVWewqYVEp1cgcznxmD6jIRZEs4NQElDBeVb2SD2QYNgB4ffkhWLYoaOP1LQQCYo1zMek-ujTN2HLR-386-EzG8J0Cc1pEcIvwIrin8XvzedZMZhe9NKHAZIa4CY9muh4QjCb5KPcj-k5lG3Qrf3syztn_vZSCvtUbDWTIuLk68eAU3fWXRq-QEdG3pyloUpBZ_CQJ4fdj7QfR4W5xJE3UxkBTEtOExqkuS8FTf4OAY5IaXfyRH6zo8KuA';

      beforeAll(() => {
        console.log('token:', token);
      });

      it('mutation createPost', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .set('authorization', 'Bearer ' + token)
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
