import React, { useState } from 'react'
import type { QueryEditorProps } from './types'
import { Play, Code, RefreshCw, AlertCircle } from 'lucide-react'

export const QueryEditor: React.FC<QueryEditorProps> = ({
  onExecuteQuery,
  isLoading,
  error,
  initialQuery = '',
  initialVariables = ''
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [variables, setVariables] = useState(initialVariables)
  const [showVariables, setShowVariables] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      const vars = variables.trim() ? JSON.parse(variables) : undefined
      await onExecuteQuery(query, vars)
    } catch (err) {
      // JSON parsing error
      alert('Invalid JSON in variables')
    }
  }

  const loadExampleQuery = () => {
    setQuery(`query GetPosts($limit: Int, $skip: Int) {
  posts(limit: $limit, skip: $skip) {
    posts {
      id
      title
      body
      tags
      reactions {
        likes
        dislikes
      }
    }
    total
  }
}`)
    setVariables(`{
  "limit": 5,
  "skip": 0
}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Code size={18} />
          Query Editor
        </h3>
        <button
          onClick={loadExampleQuery}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Load Example
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GraphQL Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter your GraphQL query here..."
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowVariables(!showVariables)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            {showVariables ? 'Hide' : 'Show'} Variables
          </button>
          
          {showVariables && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variables (JSON)
              </label>
              <textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder='{"key": "value"}'
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play size={18} />
                Execute Query
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}