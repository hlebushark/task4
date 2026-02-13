import type { ReactNode } from 'react'
import React from 'react'

interface LayoutProps {
  sidebar: ReactNode
  main: ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, main }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
            
          <aside className="w-85 shrink-0">
            <div className="sticky top-24 h-[calc(100vh-6rem)]">
              <div className="h-full overflow-y-auto pr-2">
                {sidebar}
              </div>
            </div>
          </aside>
          
          <main className="flex-1 max-w-2xl mx-auto">
            {main}
          </main>
        </div>
      </div>
    </div>
  )
}