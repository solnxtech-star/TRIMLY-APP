/**
 * Chat and Messaging Types
 * Types for chat/messaging-related API requests and responses
 */

import { User } from './auth.types';

// Message
export interface Message {
  id: string;
  conversation_id: string;
  sender: User | string;
  content: string;
  attachment?: string;
  is_read: boolean;
  timestamp: string;
  created_at: string;
}

// Conversation
export interface Conversation {
  id: string;
  participants: User[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

// Send Message Request
export interface SendMessageRequest {
  content: string;
  attachment?: string;
}

// Initiate Conversation Request
export interface InitiateConversationRequest {
  initial_message?: string;
}

// Paginated Messages Response
export interface PaginatedMessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Message[];
}

// List Messages Query Parameters
export interface ListMessagesParams {
  page?: number;
  limit?: number;
}
