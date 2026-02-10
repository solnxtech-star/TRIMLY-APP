import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API configuration
const API_BASE_URL = 'https://trimly-app.onrender.com/api/v1';

// Storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

/**
 * API Client for making HTTP requests to the Trimly backend
 * Handles authentication, token refresh, and error handling
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get stored access token
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Store authentication tokens
   */
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  }

  /**
   * Clear authentication tokens and user data
   */
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  }

  /**
   * Store user data
   */
  async storeUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newAccessToken = data.access;
      
      // Store new access token
      await AsyncStorage.setItem(TOKEN_KEY, newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear tokens if refresh fails
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Make an authenticated API request
   * @param endpoint - API endpoint (without base URL)
   * @param options - Fetch options (method, headers, body, etc.)
   * @param requiresAuth - Whether the request requires authentication
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      // Add authorization header if authentication is required
      if (requiresAuth) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      console.log('🌐 [API CLIENT] Request:', {
        url,
        method: options.method || 'GET',
        body: options.body ? JSON.parse(options.body as string) : null,
        requiresAuth,
        headers
      });

      let response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📡 [API CLIENT] Response status:', response.status);
      console.log('📡 [API CLIENT] Response ok:', response.ok);

      // If unauthorized and requires auth, try to refresh token
      if (response.status === 401 && requiresAuth) {
        const newToken = await this.refreshAccessToken();
        
        if (newToken) {
          // Retry request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          throw new Error('Authentication failed');
        }
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [API CLIENT] Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw {
          status: response.status,
          message: errorData.detail || errorData.message || response.statusText,
          data: errorData,
        };
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Parse and return JSON response
      const data = await response.json();
      console.log('✅ [API CLIENT] Success response data:', data);
      return data as T;
    } catch (error: any) {
      console.error('❌ [API CLIENT] Request Error:', error);
      console.error('❌ Error name:', error?.name);
      console.error('❌ Error message:', error?.message);
      if (error?.name === 'TypeError' && error?.message?.includes('Network request failed')) {
        console.error('🔴 NETWORK ERROR: Check your internet connection or API server status');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, requiresAuth);
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      requiresAuth
    );
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      requiresAuth
    );
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requiresAuth);
  }

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    requiresAuth: boolean = true
  ): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: Record<string, string> = {};

      // Add authorization header if authentication is required
      if (requiresAuth) {
        const accessToken = await this.getAccessToken();
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      let response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      // If unauthorized and requires auth, try to refresh token
      if (response.status === 401 && requiresAuth) {
        const newToken = await this.refreshAccessToken();
        
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
          });
        } else {
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.detail || errorData.message || response.statusText,
          data: errorData,
        };
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
