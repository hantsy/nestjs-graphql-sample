import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
}

const GET_POSTS = gql`
  query GetPosts($keyword: String, $skip: Int, $take: Int) {
    posts(keyword: $keyword, skip: $skip, take: $take) {
      id
      title
      content
      createdAt
    }
    postCount(keyword: $keyword)
  }
`;

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      createdAt
      updatedAt
      comments {
        id
        content
        postId
        createdAt
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      createdAt
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: String!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      createdAt
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id)
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($input: CreateCommentInput!) {
    addComment(input: $input) {
      id
      content
      postId
      createdAt
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class PostService {
  private apollo = inject(Apollo);

  getPosts(keyword = '', skip = 0, take = 25) {
    return this.apollo.query<{ posts: Post[]; postCount: number }>({
      query: GET_POSTS,
      variables: { keyword, skip, take },
    });
  }

  getPost(id: string) {
    return this.apollo.query<{ post: Post }>({
      query: GET_POST,
      variables: { id },
    });
  }

  createPost(title: string, content: string) {
    return this.apollo.mutate<{ createPost: Post }>({
      mutation: CREATE_POST,
      variables: { input: { title, content } },
    });
  }

  updatePost(id: string, title: string, content: string) {
    return this.apollo.mutate<{ updatePost: Post }>({
      mutation: UPDATE_POST,
      variables: { id, input: { title, content } },
    });
  }

  deletePost(id: string) {
    return this.apollo.mutate<{ deletePost: boolean }>({
      mutation: DELETE_POST,
      variables: { id },
    });
  }

  addComment(postId: string, content: string) {
    return this.apollo.mutate<{ addComment: Comment }>({
      mutation: ADD_COMMENT,
      variables: { input: { postId, content } },
    });
  }
}
