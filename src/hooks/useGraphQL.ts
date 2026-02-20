import { useState, useCallback } from 'react'
import { graphqlClient } from '../lib/graphql-client'
import type { QueryHistoryItem } from '../api/graphql/types'

export const useGraphQL = () => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<any>(null)

  const executeQuery = useCallback(async <T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    setLastResult(null)

    try {
      console.log('Executing query:', { query, variables })
      const data = await graphqlClient.request<T>(query, variables)
      console.log('Query result:', data)
      
      setHistory(graphqlClient.getHistory())
      setLastResult(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'GraphQL request failed'
      console.error('Query error:', errorMessage)
      setError(errorMessage)
      setHistory(graphqlClient.getHistory())
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearHistory = useCallback(() => {
    graphqlClient.clearHistory()
    setHistory([])
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }, [])

  return {
    history,
    isLoading,
    error,
    lastResult,
    executeQuery,
    clearHistory,
    removeFromHistory
  }
}