import React, { useState } from 'react'
import { ChatRoom } from './components/ChatRoom'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Info } from 'lucide-react'

const ChatPage: React.FC = () => {
  const [username, setUsername] = useState('Guest')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">WebSocket Chat</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 shrink-0 mt-1" size={20} />
            <p className="text-blue-700 text-sm">This chat uses a public WebSocket echo server.</p>
          </div>
        </div>
      </div>

      <ChatRoom username={username} onUsernameChange={setUsername} />
    </div>
  )
}

export default ChatPage