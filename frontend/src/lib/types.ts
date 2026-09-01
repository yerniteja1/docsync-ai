export interface User {
  id: string
  name: string
  email: string
}

export interface Document {
  id: string
  title: string
  created: string
}

export interface DocumentDetail extends Document {
  content: string
  user_id: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface LoginResponse {
  token: string
  refresh_token: string
  user: User
}

export interface RefreshResponse {
  token: string
  refresh_token: string
}

export interface ChatResponse {
  reply: string
}

export interface ApiError {
  detail: string
}
