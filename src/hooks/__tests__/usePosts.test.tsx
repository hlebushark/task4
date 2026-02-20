import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePosts, usePost, useCreatePost, useUpdatePost, useDeletePost } from '../usePosts'
import { postsApi } from '../../api/posts'
import React from 'react'

vi.mock('../../api/posts', () => ({
  postsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('usePosts hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches posts successfully', async () => {
    const mockPosts = {
      posts: [
        { id: 1, title: 'Post 1', body: 'Content 1', userId: 1, tags: [], reactions: { likes: 0, dislikes: 0 } }
      ],
      total: 1,
      skip: 0,
      limit: 10
    }
    
    vi.mocked(postsApi.getAll).mockResolvedValue(mockPosts)

    const { result } = renderHook(() => usePosts(10, 0), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockPosts)
    expect(postsApi.getAll).toHaveBeenCalledWith(10, 0)
  })

  it('handles error when fetching posts fails', async () => {
    const error = new Error('Failed to fetch')
    vi.mocked(postsApi.getAll).mockRejectedValue(error)

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })
})

describe('usePost hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches single post successfully', async () => {
    const mockPost = { 
      id: 1, 
      title: 'Post 1', 
      body: 'Content 1', 
      userId: 1, 
      tags: [], 
      reactions: { likes: 0, dislikes: 0 } 
    }
    
    vi.mocked(postsApi.getById).mockResolvedValue(mockPost)

    const { result } = renderHook(() => usePost(1), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockPost)
    expect(postsApi.getById).toHaveBeenCalledWith(1)
  })

  it('does not fetch when id is 0', async () => {
    const { result } = renderHook(() => usePost(0), {
      wrapper: createWrapper()
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(postsApi.getById).not.toHaveBeenCalled()
    expect(result.current.isPending).toBe(true) 
  })
})

describe('useCreatePost hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates post successfully', async () => {
    const newPost = { title: 'New Post', body: 'Content', userId: 1, tags: [] }
    const expectedPost = { 
      ...newPost, 
      reactions: { likes: 0, dislikes: 0 } 
    }
    const mockResponse = { id: 2, ...expectedPost }
    
    vi.mocked(postsApi.create).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper()
    })

    result.current.mutate(newPost)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(postsApi.create).toHaveBeenCalledWith(expectedPost)
  })
})

describe('useUpdatePost hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates post successfully', async () => {
    const updateData = { title: 'Updated Title' }
    const expectedData = { ...updateData, tags: [] }
    const mockResponse = { 
      id: 1, 
      title: 'Updated Title', 
      body: 'Content', 
      userId: 1, 
      tags: [], 
      reactions: { likes: 0, dislikes: 0 } 
    }
    
    vi.mocked(postsApi.update).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useUpdatePost(), {
      wrapper: createWrapper()
    })

    result.current.mutate({ id: 1, data: updateData })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(postsApi.update).toHaveBeenCalledWith(1, expectedData)
  })
})

describe('useDeletePost hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes post successfully', async () => {
    vi.mocked(postsApi.delete).mockResolvedValue()

    const { result } = renderHook(() => useDeletePost(), {
      wrapper: createWrapper()
    })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(postsApi.delete).toHaveBeenCalledWith(1)
  })
})