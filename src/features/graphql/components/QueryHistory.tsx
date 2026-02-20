import React from 'react'
import type { QueryHistoryProps } from './types'
import { Clock, CheckCircle, XCircle, Trash2, Copy, ChevronRight } from 'lucide-react'

export const QueryHistory: React.FC<QueryHistoryProps> = ({
  history,
  onSelectQuery,
  onClearHistory,
  onRemoveQuery
}) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString()
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No query history yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Execute some GraphQL queries to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Query History</h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.status === 'success' ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {formatTime(item.timestamp)}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDuration(item.duration)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(item.query)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Copy query"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => onRemoveQuery(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Remove from history"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => onSelectQuery(item)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Use this query"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="mb-2">
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {item.query.length > 100
                  ? item.query.substring(0, 100) + '...'
                  : item.query
                }
              </pre>
            </div>

            {item.variables && Object.keys(item.variables).length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium text-gray-600 mb-1">Variables:</div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(item.variables, null, 2)}
                </pre>
              </div>
            )}

            {item.status === 'success' && item.data && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Result:</div>
                <pre className="text-xs bg-green-50 p-2 rounded overflow-x-auto max-h-20">
                  {JSON.stringify(item.data, null, 2).substring(0, 100)}...
                </pre>
              </div>
            )}

            {item.status === 'error' && item.error && (
              <div>
                <div className="text-xs font-medium text-red-600 mb-1">Error:</div>
                <pre className="text-xs bg-red-50 text-red-600 p-2 rounded overflow-x-auto">
                  {item.error}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}