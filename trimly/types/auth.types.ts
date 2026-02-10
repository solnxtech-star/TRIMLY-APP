/**
 * Authentication and User Types
 * Types for authentication-related API requests and responses
 */

// Gender types
export type Gender = 'male' | 'female' | 'other';

// User roles
export type UserRole = 'customer' | 'vendor' | 'salon_owner' | 'admin';

// Salon Profile
export interface SalonProfile {
  id: string;
  bio: string;
  flw_subaccount_id: string;
  bank_code: string;
  account_number: string;
  profile_pic: string;
  address: string;
  date_of_birth: string;
  Gender: Gender;
  user: string;
}

// Vendor Profile
export interface VendorProfile {
  id: string;
  date_of_birth: string;
  bio: string;
  profile_pic: string;
  years_of_experience: number;
  Gender: Gender;
  latitude: string;
  longitude: string;
  address: string;
  flw_subaccount_id: string;
  bank_code: string;
  account_number: string;
  total_earnings: number;
  is_active: boolean;
  is_available: boolean;
  worker: string;
  category: number;
}

// User interface
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  role: UserRole;
  salon_profile?: SalonProfile | null;
  vendor_profile?: VendorProfile | null;
}

// Authentication tokens
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Registration request
export interface RegisterRequest {
  email: string;
  password1: string;
  password2: string;
  role: UserRole;
  phone_number: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login/Registration response (same structure)
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

// Alias for backward compatibility
export type RegisterResponse = LoginResponse;

// Token refresh request
export interface TokenRefreshRequest {
  refresh: string;
}

// Token refresh response
export interface TokenRefreshResponse {
  access: string;
}

// Logout request
export interface LogoutRequest {
  refresh: string;
}

// Password change request
export interface PasswordChangeRequest {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset confirm request
export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}

// Google auth request
export interface GoogleAuthRequest {
  access_token: string;
}

// Google auth response (same as login/registration)
export type GoogleAuthResponse = LoginResponse;

// Update user profile request
export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_image?: string;
}

// API Error
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// Generic API response
export interface ApiResponse<T = any> {
  detail?: string;
  message?: string;
  data?: T;
}
