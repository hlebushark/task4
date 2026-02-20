import type { QueryHistoryItem } from '../../../api/graphql/types'

export interface QueryHistoryProps {
  history: QueryHistoryItem[]
  onSelectQuery: (item: QueryHistoryItem) => void
  onClearHistory: () => void
  onRemoveQuery: (id: string) => void
}

export interface QueryEditorProps {
  onExecuteQuery: (query: string, variables?: Record<string, any>) => Promise<any>
  isLoading: boolean
  error: string | null
  initialQuery?: string
  initialVariables?: string
}