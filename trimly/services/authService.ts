import apiClient from '../utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ConfirmOtpRequest,
  ConfirmOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  GoogleAuthRequest,
  GoogleAuthResponse,
  UpdateUserRequest,
  User,
  ApiError,
} from '../types/auth.types';

const LOGIN_EMAIL_KEY = 'login_email';
const LOGIN_PASSWORD_KEY = 'login_password';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Register a new user
   * @param data - Registration data (email, password, role, etc.)
   * @returns Registration response with verification message
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(
        '/auth/registration/',
        data,
        false
      );
      
      // Note: Registration does not return tokens immediately
      // User must verify email first before logging in
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Confirm OTP for email verification
   * @param data - OTP confirmation data
   * @returns Success message
   */
  async confirmOtp(data: ConfirmOtpRequest): Promise<ConfirmOtpResponse> {
    try {
      const response = await apiClient.post<ConfirmOtpResponse>(
        '/auth/registration/confirm-otp/',
        data,
        false
      );
      return response;
    } catch (error) {
      console.error('Confirm OTP error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Resend OTP for email verification or password reset
   * @param data - Resend OTP data
   * @returns Success message
   */
  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const response = await apiClient.post<ResendOtpResponse>(
        '/auth/resend-otp/',
        data,
        false
      );
      return response;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Login user
   * @param data - Login credentials (email, password)
   * @returns Authentication tokens and user data
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('AuthService.login - Request data:', JSON.stringify(data));
      
      const response = await apiClient.post<LoginResponse>(
        '/auth/login/',
        data,
        false
      );
      
      console.log('AuthService.login - Response received:', {
        hasAccess: !!response.access,
        hasRefresh: !!response.refresh,
        userRole: response.user?.role
      });
      
      await AsyncStorage.multiSet([
        [LOGIN_EMAIL_KEY, data.email],
        [LOGIN_PASSWORD_KEY, data.password],
      ]);

      // Store tokens and user data
      if (response.access && response.refresh) {
        await apiClient.storeTokens(response.access, response.refresh);
        await apiClient.storeUserData(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Resend verification email
   * @param email - User's email address
   * @returns Success message
   */
  async resendVerificationEmail(email: string): Promise<{ detail: string }> {
    try {
      const response = await apiClient.post<{ detail: string }>(
        '/auth/registration/resend-email/',
        { email },
        false
      );
      
      return response;
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   * Clears tokens and user data from storage
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - clears token on backend)
      try {
        await apiClient.request('/auth/logout/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: undefined // Send empty body as requested
        }, true);
      } catch (error) {
        console.warn('Logout API call failed, continuing with local logout');
      }
      
      // Clear local storage
      await apiClient.clearTokens();
      await AsyncStorage.multiRemove([LOGIN_EMAIL_KEY, LOGIN_PASSWORD_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if there's an error
      await apiClient.clearTokens();
      throw this.handleError(error);
    }
  }

  /**
   * Get current user profile
   * @returns User data
   */
  async getCurrentUser(): Promise<User> {
    try {
      // First try to get from local storage
      const cachedUser = await apiClient.getUserData();
      
      // Then fetch fresh data from API
      const response = await apiClient.get<User>('/auth/user/', true);
      
      // Update cached user data
      await apiClient.storeUserData(response);
      
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update current user profile
   * @param data - Updated user data
   * @returns Updated user data
   */
  async updateProfile(data: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.patch<User>('/auth/user/', data, true);
      
      // Update cached user data
      await apiClient.storeUserData(response);
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Change user password
   * @param data - Password change data (old password, new password)
   */
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    try {
      await apiClient.post('/auth/password/change/', data, true);
    } catch (error) {
      console.error('Change password error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Request password reset email
   * @param data - Email for password reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      await apiClient.post('/auth/password/reset/', data, false);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Confirm password reset with token
   * @param data - Reset token and new password
   */
  async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<void> {
    try {
      await apiClient.post('/auth/password/reset/confirm/', data, false);
    } catch (error) {
      console.error('Password reset confirm error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Google authentication
   * @param data - Google access token
   * @returns User data and authentication tokens
   */
  async googleAuth(data: GoogleAuthRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/google/',
        data,
        false
      );
      
      // Store tokens and user data
      if (response.access && response.refresh) {
        await apiClient.storeTokens(response.access, response.refresh);
        await apiClient.storeUserData(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Google auth error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const userData = await apiClient.getUserData();
      return userData !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cached user data
   * @returns Cached user data or null
   */
  async getCachedUser(): Promise<User | null> {
    try {
      return await apiClient.getUserData();
    } catch (error) {
      return null;
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
const authService = new AuthService();

export default authService;
