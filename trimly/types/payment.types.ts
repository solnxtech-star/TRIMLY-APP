/**
 * Payment Types
 * Types for payment-related API requests and responses
 */

// Payment Method
export type PaymentMethod = 'card' | 'bank_transfer' | 'wallet';

// Payment Status
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled';

// Payment
export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  authorization_url?: string;
  created_at: string;
  updated_at: string;
}

// Initialize Payment Request
export interface InitializePaymentRequest {
  booking_id: string;
  payment_method: PaymentMethod;
}

// Initialize Payment Response
export interface InitializePaymentResponse {
  payment_id: string;
  authorization_url: string;
  reference: string;
  amount: number;
}

// Subaccount
export interface Subaccount {
  id: string;
  subaccount_id: string;
  subaccount_code: string;
  business_name: string;
  bank_code: string;
  account_number: string;
  percentage_charge?: number;
  is_active: boolean;
  created_at: string;
}

// Create Subaccount Request
export interface CreateSubaccountRequest {
  business_name: string;
  bank_code: string;
  account_number: string;
  percentage_charge?: number;
}

// Create Subaccount Response
export interface CreateSubaccountResponse {
  subaccount_id: string;
  subaccount_code: string;
  business_name: string;
  bank_code: string;
  account_number: string;
}

// Withdrawal
export interface Withdrawal {
  id: string;
  withdrawal_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'successful' | 'failed';
  account_id: string;
  created_at: string;
  updated_at: string;
}

// Withdraw Request
export interface WithdrawRequest {
  amount: number;
  account_id: string;
}

// Withdraw Response
export interface WithdrawResponse {
  withdrawal_id: string;
  status: string;
  amount: number;
}

// Payment Verification Response
export interface PaymentVerificationResponse {
  status: PaymentStatus;
  reference: string;
  amount: number;
  payment_id: string;
}
