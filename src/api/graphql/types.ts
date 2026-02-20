export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
}

export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  image: string
}

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: {
    username: string
  }
}

export interface PostsQueryResponse {
  posts: {
    posts: Post[]
    total: number
    skip: number
    limit: number
  }
}

export interface PostQueryResponse {
  post: Post
}

export interface UsersQueryResponse {
  users: {
    users: User[]
    total: number
  }
}

export interface CommentsQueryResponse {
  comments: {
    comments: Comment[]
    total: number
  }
}

// Типы для истории запросов
export interface QueryHistoryItem {
  id: string
  query: string
  variables?: Record<string, any>
  timestamp: Date
  duration: number
  status: 'success' | 'error'
  data?: any
  error?: string
}