import React, { useEffect, useRef } from 'react'
import type { MessageListProps } from './types'
import { User, Bot } from 'lucide-react'

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUsername 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Bot size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isMine = message.username === currentUsername

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isMine ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
              {isMine ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-gray-600" />
              )}
            </div>

            {/* Message and username */}
            <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center gap-2 mb-1 ${
                isMine ? 'justify-end' : 'justify-start'
              }`}>
                <span className="font-medium text-sm text-gray-600">
                  {message.username}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              <div className={`
                rounded-lg p-3 wrap-break-words
                ${isMine 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }
              `}>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}