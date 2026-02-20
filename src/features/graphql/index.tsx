import React, { useState } from 'react'
import { QueryEditor } from './components/QueryEditor'
import { QueryHistory } from './components/QueryHistory'
import { useGraphQL } from '../../hooks/useGraphQL'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Database } from 'lucide-react'
import type { QueryHistoryItem } from '../../api/graphql/types'

const GraphQLPage: React.FC = () => {
  const { 
    history, 
    isLoading, 
    error, 
    executeQuery, 
    clearHistory, 
    removeFromHistory 
  } = useGraphQL()
  
  const [selectedQuery, setSelectedQuery] = useState<QueryHistoryItem | null>(null)

  const handleExecuteQuery = async (query: string, variables?: Record<string, any>) => {
    console.log('Executing in page:', { query, variables })
    const result = await executeQuery(query, variables)
    console.log('Page received result:', result)
    return result
  }

  const handleSelectQuery = (item: QueryHistoryItem) => {
    console.log('Selected query from history:', item)
    setSelectedQuery(item)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">GraphQL Explorer</h1>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Database className="text-purple-600 shrink-0 mt-1" size={20} />
              <p className="text-purple-700 text-sm">
                Execute GraphQL queries against DummyJSON's posts.
                Query history is stored locally in memory.
              </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col - editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <QueryEditor
              onExecuteQuery={handleExecuteQuery}
              isLoading={isLoading}
              error={error}
              initialQuery={selectedQuery?.query}
              initialVariables={selectedQuery?.variables 
                ? JSON.stringify(selectedQuery.variables, null, 2)
                : ''
              }
            />
          </div>
        </div>

        {/* Right col - history */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <QueryHistory
              history={history}
              onSelectQuery={handleSelectQuery}
              onClearHistory={clearHistory}
              onRemoveQuery={removeFromHistory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphQLPage