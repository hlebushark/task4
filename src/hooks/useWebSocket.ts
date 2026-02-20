import { useState, useEffect, useCallback, useRef } from 'react'
import type { ChatMessage } from '../lib/websocket'

const WS_URL = 'wss://echo.websocket.org'

export const useWebSocket = (username: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const pendingMessagesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onopen = () => {
          setIsConnected(true)
          setError(null)
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (!pendingMessagesRef.current.has(data.id)) {
              setMessages(prev => [...prev, data])
            } else {
              pendingMessagesRef.current.delete(data.id)
            }
          } catch (error) {
            console.error('Failed to parse message:', error)
          }
        }

        ws.onclose = () => {
          setIsConnected(false)
        }

        ws.onerror = () => {
          setError('WebSocket connection error')
        }
      } catch (err) {
        setError('Failed to connect to WebSocket')
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        userId: `user-${Math.random().toString(36).substring(7)}`,
        username,
        text,
        timestamp: new Date(),
        type: 'message'
      }

      pendingMessagesRef.current.add(message.id)
      
      setMessages(prev => [...prev, message])
      
      wsRef.current.send(JSON.stringify(message))
    } else {
      setError('Cannot send message: not connected')
    }
  }, [username])

  return {
    messages,
    isConnected,
    error,
    sendMessage
  }
}