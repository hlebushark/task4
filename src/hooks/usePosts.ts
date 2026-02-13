import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../api/posts'
import type { CreatePostRequest, UpdatePostRequest } from '../api/types'

const POSTS_QUERY_KEY = 'posts'

export const usePosts = (limit: number = 9, skip: number = 0) => {
  return useQuery({
    queryKey: [POSTS_QUERY_KEY, limit, skip],
    queryFn: () => postsApi.getAll(limit, skip),
  })
}

export const usePost = (id: number) => {
  return useQuery({
    queryKey: [POSTS_QUERY_KEY, id],
    queryFn: () => postsApi.getById(id),
    enabled: !!id,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreatePostRequest) => {
      const normalizedData = {
        ...data,
        tags: Array.isArray(data.tags) 
          ? data.tags 
          : typeof data.tags === 'string'
            ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : [],
        reactions: data.reactions || { likes: 0, dislikes: 0 }
      }
      
      return postsApi.create(normalizedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] })
    },
  })
}

export const useUpdatePost = (id: number) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postsApi.update(id, data),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData([POSTS_QUERY_KEY, id], updatedPost)
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => postsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] })
      queryClient.removeQueries({ queryKey: [POSTS_QUERY_KEY, id] })
    },
  })
}