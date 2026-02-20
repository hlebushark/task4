import React from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useWebSocket } from '../../../hooks/useWebSocket'
import type { ChatRoomProps } from './types'
import { Wifi, WifiOff } from 'lucide-react'

export const ChatRoom: React.FC<ChatRoomProps> = ({ 
  username, 
  onUsernameChange 
}) => {
  const { messages, isConnected, error, sendMessage } = useWebSocket(username)
  const [newUsername, setNewUsername] = React.useState(username)

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUsername.trim() && newUsername !== username) {
      onUsernameChange(newUsername.trim())
    }
  }

  return (
    <div className="flex flex-col h-150 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Chat Room</h2>
            
            {/* Connection status */}
            {isConnected ? (
              <span className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
                <Wifi size={14} />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 text-sm bg-red-50 px-3 py-1 rounded-full">
                <WifiOff size={14} />
                Disconnected
              </span>
            )}
          </div>
          
          {/* Change user */}
          <form onSubmit={handleUsernameSubmit} className="flex gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={newUsername === username || !newUsername.trim()}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Change
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}
      </div>

      <MessageList messages={messages} currentUsername={username} />

      <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
    </div>
  )
}