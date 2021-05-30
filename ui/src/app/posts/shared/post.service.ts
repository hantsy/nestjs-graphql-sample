import { Injectable } from '@angular/core';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Comment } from './comment.model';
import { Post } from './post.model';

@Injectable()
export class PostService {
  constructor(private readonly apollo: Apollo) {}

  getPosts(term?: any): Observable<ApolloQueryResult<any>> {
    // const params: HttpParams = new HttpParams();
    // if (term) {
    //   Object.keys(term).map((key) => {
    //     if (term[key]) {
    //       params.set(key, term[key]);
    //     }
    //   });
    // }

    //
    // omit search terms now.
    const queryGql = gql`
      query {
        getAllPosts {
          id
          title
          content
          createdAt
          authorId
          author {
            id
          }
        }
      }
    `;
    return this.apollo.watchQuery({ query: queryGql }).valueChanges;
  }

  getPost(id: string): Observable<ApolloQueryResult<unknown>> {
    const queryGql = gql`
      query ($id: String!) {
        getPostById(postId: $id) {
          id
          title
          content
          authorId
          author {
            id
          }
          createdAt
          comments {
            content
          }
        }
      }
    `;
    return this.apollo.query({
      query: queryGql,
      variables: {
        id: id,
      },
    });
  }

  savePost(data: Post): Observable<FetchResult<unknown, unknown, unknown>> {
    const queryGql = gql`
      mutation ($createPostInput: PostInput!) {
        createPost(createPostInput: $createPostInput) {
          id
          title
        }
      }
    `;
    return this.apollo.mutate({
      mutation: queryGql,
      variables: {
        createPostInput: {
          id: data.id,
          title: data.title,
          content: data.content,
        },
      },
    });
  }

  saveComment(
    id: string,
    data: Comment
  ): Observable<FetchResult<unknown, unknown, unknown>> {
    const queryGql = gql`
      mutation ($commentInput: CommentInput!) {
        addComment(commentInput: $commentInput) {
          id
          content
        }
      }
    `;
    return this.apollo.mutate({
      mutation: queryGql,
      variables: {
        commentInput: {
          postId: id,
          content: data.content,
        },
      },
    });
  }
}
