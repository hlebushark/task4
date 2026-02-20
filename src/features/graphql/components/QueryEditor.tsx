import React, { useState, useEffect } from 'react'
import type { QueryEditorProps } from './types'
import { Play, Code, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

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
  const [result, setResult] = useState<any>(null)
  const [executionError, setExecutionError] = useState<string | null>(null)

  // Обновляем состояние при изменении initialQuery/initialVariables
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
    if (initialVariables) {
      setVariables(initialVariables)
    }
  }, [initialQuery, initialVariables])

  // Обновляем результат при изменении error из пропсов
  useEffect(() => {
    if (error) {
      setExecutionError(error)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setExecutionError(null)
    setResult(null)

    try {
      let vars = undefined
      if (variables.trim()) {
        try {
          vars = JSON.parse(variables)
        } catch (e) {
          setExecutionError('Invalid JSON in variables')
          return
        }
      }
      
      console.log('Submitting query:', { query, vars })
      const data = await onExecuteQuery(query, vars)
      console.log('Received data:', data)
      
      if (data) {
        setResult(data)
      }
    } catch (err) {
      console.error('Execution error:', err)
      setExecutionError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const loadExampleQuery = () => {
    setQuery(`query {
  posts(limit: 5, skip: 0) {
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
    setResult(null)
    setExecutionError(null)
  }

  const loadPostByIdExample = () => {
    setQuery(`query {
  post(id: 1) {
    id
    title
    body
    userId
    tags
    reactions {
      likes
      dislikes
    }
  }
}`)
    setVariables('{}')
    setResult(null)
    setExecutionError(null)
  }

  const loadSearchExample = () => {
    setQuery(`query {
  searchPosts(q: "love") {
    posts {
      id
      title
      body
      tags
    }
    total
  }
}`)
    setVariables('{}')
    setResult(null)
    setExecutionError(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Code size={18} />
          Query Editor
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GraphQL Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={10}
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

        {(executionError || error) && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="text-sm">{executionError || error}</div>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} />
              <span className="font-medium">Query executed successfully!</span>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <pre className="text-xs overflow-x-auto max-h-100">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
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

      <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="font-medium mb-1">📝 Available Operations:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>
            <button
              type="button"
              onClick={loadExampleQuery}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded-lg"
            >
              Get posts
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={loadPostByIdExample}
              className="text-xs text-green-600 hover:text-green-800 px-2 py-1 bg-green-50 rounded-lg"
            >
              Post by ID
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={loadSearchExample}
              className="text-xs text-purple-600 hover:text-purple-800 px-2 py-1 bg-purple-50 rounded-lg"
            >
              Search
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}