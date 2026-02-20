import { postsApi } from '../api/posts'
import type { QueryHistoryItem } from '../api/graphql/types'

async function executeGraphQLQuery(query: string, variables?: Record<string, any>) {
  console.log('Processing query:', { query, variables })

  if (query.includes('posts') && !query.includes('post(')) {
    const limit = variables?.limit || 10
    const skip = variables?.skip || 0
    return await postsApi.getAll(limit, skip)
  }
  
  if (query.includes('post(') || query.includes('post {')) {
    const id = variables?.id || 1
    return await postsApi.getById(id)
  }
  
  if (query.includes('searchPosts')) {
    const q = variables?.q || ''
    return await postsApi.search(q)
  }

  throw new Error('Unsupported query')
}

export class GraphQLClientWithHistory {
  private history: QueryHistoryItem[] = []
  private maxHistorySize = 50

  async request<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now()
    const id = Math.random().toString(36).substring(7)
    
    try {
      console.log('Executing GraphQL query:', { query, variables })
      
      const data = await executeGraphQLQuery(query, variables)
      const duration = Date.now() - startTime

      const historyItem: QueryHistoryItem = {
        id,
        query,
        variables,
        timestamp: new Date(),
        duration,
        status: 'success',
        data
      }

      this.addToHistory(historyItem)
      return data as T
    } catch (error) {
      const duration = Date.now() - startTime
      
      let errorMessage = 'Unknown error'
      if (error instanceof Error) {
        errorMessage = error.message
      }

      const historyItem: QueryHistoryItem = {
        id,
        query,
        variables,
        timestamp: new Date(),
        duration,
        status: 'error',
        error: errorMessage
      }

      this.addToHistory(historyItem)
      throw error
    }
  }

  private addToHistory(item: QueryHistoryItem) {
    this.history.unshift(item)
    if (this.history.length > this.maxHistorySize) {
      this.history.pop()
    }
  }

  getHistory(): QueryHistoryItem[] {
    return [...this.history]
  }

  clearHistory() {
    this.history = []
  }
}

export const graphqlClient = new GraphQLClientWithHistory()