import apiClient from '../utils/apiClient';
import {
  Payment,
  InitializePaymentRequest,
  InitializePaymentResponse,
  CreateSubaccountRequest,
  CreateSubaccountResponse,
  WithdrawRequest,
  WithdrawResponse,
  PaymentVerificationResponse,
} from '../types/payment.types';
import { ApiError } from '../types/auth.types';

/**
 * Payment Service
 * Handles all payment-related API calls
 */
class PaymentService {
  /**
   * Initialize payment for a booking
   * @param data - Payment initialization data
   * @returns Payment authorization details
   */
  async initializePayment(data: InitializePaymentRequest): Promise<InitializePaymentResponse> {
    try {
      const response = await apiClient.post<InitializePaymentResponse>(
        '/payments/initialize/',
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Initialize payment error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify payment status
   * @param reference - Payment reference
   * @returns Payment verification result
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.get<PaymentVerificationResponse>(
        `/payments/verify/${reference}/`,
        true
      );
      return response;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get payment history
   * @returns List of payments
   */
  async getPaymentHistory(): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>('/payments/', true);
      return response;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get payment details
   * @param paymentId - Payment ID
   * @returns Payment details
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    try {
      const response = await apiClient.get<Payment>(`/payments/${paymentId}/`, true);
      return response;
    } catch (error) {
      console.error('Get payment error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a payment subaccount (for salon owners/vendors)
   * @param data - Subaccount creation data
   * @returns Created subaccount details
   */
  async createSubaccount(data: CreateSubaccountRequest): Promise<CreateSubaccountResponse> {
    try {
      const response = await apiClient.post<CreateSubaccountResponse>(
        '/payments/create_subaccounts/',
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Create subaccount error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Request withdrawal (for salon owners/vendors)
   * @param data - Withdrawal request data
   * @returns Withdrawal details
   */
  async requestWithdrawal(data: WithdrawRequest): Promise<WithdrawResponse> {
    try {
      const response = await apiClient.post<WithdrawResponse>(
        '/payments/withdraw/',
        data,
        true
      );
      return response;
    } catch (error) {
      console.error('Request withdrawal error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get available banks for subaccount creation
   * @returns List of banks
   */
  async getBankList(): Promise<Array<{ code: string; name: string }>> {
    try {
      // This endpoint might need to be confirmed with backend
      const response = await apiClient.get<Array<{ code: string; name: string }>>(
        '/payments/banks/',
        false
      );
      return response;
    } catch (error) {
      console.error('Get bank list error:', error);
      // Return some common Nigerian banks as fallback
      return [
        { code: '044', name: 'Access Bank' },
        { code: '063', name: 'Access Bank (Diamond)' },
        { code: '050', name: 'Ecobank Nigeria' },
        { code: '070', name: 'Fidelity Bank' },
        { code: '011', name: 'First Bank of Nigeria' },
        { code: '214', name: 'First City Monument Bank' },
        { code: '058', name: 'Guaranty Trust Bank' },
        { code: '030', name: 'Heritage Bank' },
        { code: '301', name: 'Jaiz Bank' },
        { code: '082', name: 'Keystone Bank' },
        { code: '526', name: 'Parallex Bank' },
        { code: '076', name: 'Polaris Bank' },
        { code: '101', name: 'Providus Bank' },
        { code: '221', name: 'Stanbic IBTC Bank' },
        { code: '068', name: 'Standard Chartered Bank' },
        { code: '232', name: 'Sterling Bank' },
        { code: '100', name: 'Suntrust Bank' },
        { code: '032', name: 'Union Bank of Nigeria' },
        { code: '033', name: 'United Bank For Africa' },
        { code: '215', name: 'Unity Bank' },
        { code: '035', name: 'Wema Bank' },
        { code: '057', name: 'Zenith Bank' },
      ];
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
const paymentService = new PaymentService();

export default paymentService;
