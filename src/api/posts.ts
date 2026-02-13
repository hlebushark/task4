import { apiClient } from './client'
import type { Post, PostsResponse, CreatePostRequest, UpdatePostRequest } from './types'

export const postsApi = {
  getAll: (limit: number = 10, skip: number = 0): Promise<PostsResponse> => {
    return apiClient.get<PostsResponse>(`/posts?limit=${limit}&skip=${skip}`)
  },

  getById: (id: number): Promise<Post> => {
    return apiClient.get<Post>(`/posts/${id}`)
  },

  create: (data: CreatePostRequest): Promise<Post> => {
    return apiClient.post<Post>('/posts/add', data)
  },

  update: (id: number, data: UpdatePostRequest): Promise<Post> => {
    return apiClient.put<Post>(`/posts/${id}`, data)
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/posts/${id}`)
  },

  search: (query: string): Promise<PostsResponse> => {
    return apiClient.get<PostsResponse>(`/posts/search?q=${query}`)
  }
}