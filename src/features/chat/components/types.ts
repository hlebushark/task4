import type { ChatMessage } from '../../../lib/websocket'

export interface ChatRoomProps {
  username: string
  onUsernameChange: (username: string) => void
}

export interface MessageListProps {
  messages: ChatMessage[]
  currentUsername: string
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void
  disabled?: boolean
}