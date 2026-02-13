import React from 'react'
import { Loader2 } from 'lucide-react'

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  )
}