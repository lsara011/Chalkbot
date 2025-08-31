export type Role = 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatRequest {
  message: string;
  threadId?: string | null;
}

export interface ChatResponse {
  reply: string;
  threadId: string;
}

export interface ApiError {
  error?: string;
  detail?: string;
  message?: string;
}