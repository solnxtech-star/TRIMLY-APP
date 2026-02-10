import apiClient from '../utils/apiClient';
import {
  Conversation,
  Message,
  SendMessageRequest,
  InitiateConversationRequest,
  PaginatedMessagesResponse,
  ListMessagesParams,
} from '../types/chat.types';
import { ApiError } from '../types/auth.types';

/**
 * Chat Service
 * Handles all chat/messaging-related API calls
 */
class ChatService {
  /**
   * List user's conversations
   * @returns List of conversations
   */
  async listConversations(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get<Conversation[]>('/conversations/', true);
      return response;
    } catch (error) {
      console.error('List conversations error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Initiate a new conversation with a user
   * @param targetId - Target user ID
   * @param data - Initial conversation data
   * @returns Created conversation
   */
  async initiateConversation(
    targetId: string,
    data?: InitiateConversationRequest
  ): Promise<Conversation> {
    try {
      const response = await apiClient.post<Conversation>(
        `/conversations/initiate/${targetId}/`,
        data || {},
        true
      );
      return response;
    } catch (error) {
      console.error('Initiate conversation error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get messages in a conversation
   * @param conversationId - Conversation ID
   * @param params - Query parameters for pagination
   * @returns Paginated list of messages
   */
  async getMessages(
    conversationId: string,
    params?: ListMessagesParams
  ): Promise<PaginatedMessagesResponse> {
    try {
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();
      const endpoint = `/conversations/${conversationId}/messages/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<PaginatedMessagesResponse>(endpoint, true);
      return response;
    } catch (error) {
      console.error('Get messages error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send a message in a conversation
   * @param conversationId - Conversation ID
   * @param data - Message data
   * @returns Sent message
   */
  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<Message> {
    try {
      const response = await apiClient.post<Message>(
        `/conversations/${conversationId}/messages/`,
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Send message error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Mark messages as read
   * @param conversationId - Conversation ID
   * @returns Success response
   */
  async markMessagesAsRead(conversationId: string): Promise<{ detail: string }> {
    try {
      const response = await apiClient.post<{ detail: string }>(
        `/conversations/${conversationId}/mark-read/`,
        {},
        true
      );
      return response;
    } catch (error) {
      console.error('Mark messages as read error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get unread message count
   * @returns Total unread message count
   */
  async getUnreadCount(): Promise<{ unread_count: number }> {
    try {
      const conversations = await this.listConversations();
      const unread_count = conversations.reduce(
        (total, conv) => total + conv.unread_count,
        0
      );
      return { unread_count };
    } catch (error) {
      console.error('Get unread count error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format API errors
   * @param error - Error object from API
   * @returns Formatted error
   */
  private handleError(error: any): ApiError {
    if (error.status && error.message) {
      return error as ApiError;
    }
    
    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
      data: error,
    };
  }
}

// Create and export a singleton instance
const chatService = new ChatService();

export default chatService;
