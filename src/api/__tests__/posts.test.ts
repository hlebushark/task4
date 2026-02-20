//unit
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { postsApi } from '../posts'
import { apiClient } from '../client'

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('postsApi unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll should call apiClient.get with correct endpoint', async () => {
    const mockResponse = { posts: [], total: 0, skip: 0, limit: 10 }
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

    const result = await postsApi.getAll(10, 0)

    expect(apiClient.get).toHaveBeenCalledWith('/posts?limit=10&skip=0')
    expect(result).toEqual(mockResponse)
  })

  it('getById should call apiClient.get with correct id', async () => {
    const mockPost = { id: 1, title: 'Test Post', body: 'Content', userId: 1, tags: [], reactions: { likes: 0, dislikes: 0 } }
    vi.mocked(apiClient.get).mockResolvedValue(mockPost)

    const result = await postsApi.getById(1)

    expect(apiClient.get).toHaveBeenCalledWith('/posts/1')
    expect(result).toEqual(mockPost)
  })

  it('create should call apiClient.post with correct data', async () => {
    const newPost = { title: 'New Post', body: 'Content', userId: 1, tags: ['test'] }
    const mockResponse = { id: 2, ...newPost, reactions: { likes: 0, dislikes: 0 } }
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

    const result = await postsApi.create(newPost)

    expect(apiClient.post).toHaveBeenCalledWith('/posts/add', newPost)
    expect(result).toEqual(mockResponse)
  })

  it('update should call apiClient.put with correct id and data', async () => {
    const updateData = { title: 'Updated Title' }
    const mockResponse = { id: 1, title: 'Updated Title', body: 'Content', userId: 1, tags: [], reactions: { likes: 0, dislikes: 0 } }
    vi.mocked(apiClient.put).mockResolvedValue(mockResponse)

    const result = await postsApi.update(1, updateData)

    expect(apiClient.put).toHaveBeenCalledWith('/posts/1', updateData)
    expect(result).toEqual(mockResponse)
  })

  it('delete should call apiClient.delete with correct id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue()

    await postsApi.delete(1)

    expect(apiClient.delete).toHaveBeenCalledWith('/posts/1')
  })
})