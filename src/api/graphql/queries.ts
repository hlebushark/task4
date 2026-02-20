import { gql } from 'graphql-request'

export const GET_POSTS = gql`
  query GetPosts($limit: Int, $skip: Int) {
    posts(limit: $limit, skip: $skip) {
      posts {
        id
        title
        body
        userId
        tags
        reactions {
          likes
          dislikes
        }
      }
      total
      skip
      limit
    }
  }
`

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      body
      userId
      tags
      reactions {
        likes
        dislikes
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($limit: Int) {
    users(limit: $limit) {
      users {
        id
        firstName
        lastName
        username
        email
        image
      }
      total
    }
  }
`

export const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(postId: $postId) {
      comments {
        id
        body
        postId
        userId
        user {
          username
        }
      }
      total
    }
  }
`