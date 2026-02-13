import React from 'react'
import { Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'
import { Home, FileText} from 'lucide-react'

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Dummy Blog
              </Link>
              
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  activeProps={{ className: 'text-blue-600 font-semibold' }}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                
                <Link
                  to="/posts"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  activeProps={{ className: 'text-blue-600 font-semibold' }}
                >
                  <FileText size={20} />
                  <span>Posts</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 pt-20">
          <Outlet />
        </main>
      </div>
      
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}