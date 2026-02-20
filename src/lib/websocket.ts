export interface ChatMessage {
  id: string
  userId: string
  username: string
  text: string
  timestamp: Date
  type: 'message' | 'system' | 'join' | 'leave'
}

export interface WebSocketConfig {
  url: string
  onMessage?: (message: ChatMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private messageHandlers: ((message: ChatMessage) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 1000

  constructor(private config: WebSocketConfig) {}

  connect() {
    try {
      this.ws = new WebSocket(this.config.url)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.config.onOpen?.()
        
        this.sendSystemMessage('Connected to chat')
      }

      this.ws.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data)
          this.messageHandlers.forEach(handler => handler(message))
          this.config.onMessage?.(message)
        } catch (error) {
          console.error('Failed to parse message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.config.onClose?.()
        this.reconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.config.onError?.(error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectTimeout * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  sendMessage(text: string, username: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        userId: `user-${Math.random().toString(36).substring(7)}`,
        username,
        text,
        timestamp: new Date(),
        type: 'message'
      }

      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  private sendSystemMessage(text: string) {
    const message: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      userId: 'system',
      username: 'System',
      text,
      timestamp: new Date(),
      type: 'system'
    }

    this.messageHandlers.forEach(handler => handler(message))
  }

  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }
}