import { GraphQLClient } from 'graphql-request'
import type { QueryHistoryItem } from '../api/graphql/types'

const GRAPHQL_ENDPOINT = 'https://dummyjson.com/posts/'

export class GraphQLClientWithHistory {
  private client: GraphQLClient
  private history: QueryHistoryItem[] = []
  private maxHistorySize = 50

  constructor() {
    this.client = new GraphQLClient(GRAPHQL_ENDPOINT)
  }

  async request<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now()
    const id = Math.random().toString(36).substring(7)
    
    try {
      const data = await this.client.request<T>(query, variables)
      const duration = Date.now() - startTime

      this.addToHistory({
        id,
        query,
        variables,
        timestamp: new Date(),
        duration,
        status: 'success',
        data
      })

      return data
    } catch (error) {
      const duration = Date.now() - startTime

      this.addToHistory({
        id,
        query,
        variables,
        timestamp: new Date(),
        duration,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })

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