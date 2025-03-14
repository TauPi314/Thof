
// Pi Network SDK Integration
// Based on documentation at https://github.com/pi-apps/pi-platform-docs

interface PiUser {
  username: string;
  uid: string;
  accessToken: string;
}

interface PiPayment {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  uid: string;
  identifier: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
  created_at: string;
}

interface PiSDK {
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: PiPayment) => void
  ) => Promise<PiUser>;
  createPayment: (paymentData: {
    amount: number;
    memo: string;
    metadata: Record<string, any>;
  }) => Promise<PiPayment>;
  openPayment: (paymentId: string) => Promise<PiPayment>;
  submitPayment: (paymentId: string) => Promise<PiPayment>;
  completePayment: (paymentId: string) => Promise<PiPayment>;
  cancelPayment: (paymentId: string) => Promise<PiPayment>;
}

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}

// Minimum token balance required to vote
export const MIN_TOKEN_BALANCE_TO_VOTE = 1; // 1 Pi token required to vote

class PiNetworkService {
  private static instance: PiNetworkService;
  private _user: PiUser | null = null;
  private _isAuthenticated = false;
  private _tokenBalance = 0;
  private _onPaymentCompleted: ((payment: PiPayment) => void) | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): PiNetworkService {
    if (!PiNetworkService.instance) {
      PiNetworkService.instance = new PiNetworkService();
    }
    return PiNetworkService.instance;
  }

  /**
   * Initialize the Pi SDK
   */
  public init() {
    // Check if we're running in the Pi Browser
    if (this.isPiBrowser()) {
      console.log('Pi SDK detected, ready to authenticate');
    } else {
      console.log('Not running in Pi Browser. Using mock functionality.');
    }
  }

  /**
   * Check if the app is running in Pi Browser
   */
  public isPiBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.Pi !== 'undefined';
  }

  /**
   * Authenticate the user with the Pi Network
   * @param onIncompletePaymentFound Callback for handling incomplete payments
   * @returns User information or null if authentication fails
   */
  public async authenticate(
    onIncompletePaymentFound?: (payment: PiPayment) => void
  ): Promise<PiUser | null> {
    if (!this.isPiBrowser()) {
      console.log('Authentication mock: Not running in Pi Browser');
      
      // Return mock user in development environment
      if (process.env.NODE_ENV === 'development') {
        const mockUser: PiUser = {
          username: 'DemoUser',
          uid: 'demo123',
          accessToken: 'mock-token'
        };
        this._user = mockUser;
        this._isAuthenticated = true;
        this._tokenBalance = 10; // Mock token balance for development
        return mockUser;
      }
      
      return null;
    }

    try {
      // Scopes: username for basic profile info, payments for transaction capabilities
      const scopes = ['username', 'payments'];
      
      const user = await window.Pi!.authenticate(scopes, onIncompletePaymentFound);
      this._user = user;
      this._isAuthenticated = true;
      
      // Fetch token balance after authentication
      await this.fetchTokenBalance();
      
      console.log('User authenticated with Pi Network:', user.username);
      return user;
    } catch (error) {
      console.error('Pi Network authentication error:', error);
      this._isAuthenticated = false;
      return null;
    }
  }

  /**
   * Create a payment
   * @param amount Amount of Pi to transfer
   * @param memo Description of the payment
   * @param metadata Additional data about the payment
   */
  public async createPayment(
    amount: number,
    memo: string,
    metadata: Record<string, any> = {}
  ): Promise<PiPayment | null> {
    if (!this.isPiBrowser() || !this._isAuthenticated) {
      console.log('Cannot create payment: Not authenticated with Pi Network');
      return null;
    }

    try {
      const paymentData = {
        amount,
        memo,
        metadata,
      };

      const payment = await window.Pi!.createPayment(paymentData);
      return payment;
    } catch (error) {
      console.error('Pi payment creation error:', error);
      return null;
    }
  }

  /**
   * Opens a payment dialog for an existing payment
   * @param paymentId ID of the payment to open
   */
  public async openPayment(paymentId: string): Promise<PiPayment | null> {
    if (!this.isPiBrowser() || !this._isAuthenticated) {
      console.log('Cannot open payment: Not authenticated with Pi Network');
      return null;
    }

    try {
      const payment = await window.Pi!.openPayment(paymentId);
      return payment;
    } catch (error) {
      console.error('Error opening payment:', error);
      return null;
    }
  }

  /**
   * Submit a payment to the Pi blockchain
   * @param paymentId ID of the payment to submit
   */
  public async submitPayment(paymentId: string): Promise<PiPayment | null> {
    if (!this.isPiBrowser() || !this._isAuthenticated) {
      console.log('Cannot submit payment: Not authenticated with Pi Network');
      return null;
    }

    try {
      const payment = await window.Pi!.submitPayment(paymentId);
      return payment;
    } catch (error) {
      console.error('Error submitting payment:', error);
      return null;
    }
  }

  /**
   * Complete a payment after it has been submitted to the blockchain
   * @param paymentId ID of the payment to complete
   */
  public async completePayment(paymentId: string): Promise<boolean> {
    if (!this.isPiBrowser() || !this._isAuthenticated) {
      return false;
    }

    try {
      await window.Pi!.completePayment(paymentId);
      return true;
    } catch (error) {
      console.error('Error completing payment:', error);
      return false;
    }
  }

  /**
   * Cancel a payment
   * @param paymentId ID of the payment to cancel
   */
  public async cancelPayment(paymentId: string): Promise<boolean> {
    if (!this.isPiBrowser() || !this._isAuthenticated) {
      return false;
    }

    try {
      await window.Pi!.cancelPayment(paymentId);
      return true;
    } catch (error) {
      console.error('Error canceling payment:', error);
      return false;
    }
  }

  /**
   * Set a callback to be executed when a payment is completed
   * @param callback Function to execute when a payment is completed
   */
  public setOnPaymentCompleted(callback: (payment: PiPayment) => void): void {
    this._onPaymentCompleted = callback;
  }

  /**
   * Handle an incomplete payment
   * @param payment The incomplete payment object
   */
  public handleIncompletePayment(payment: PiPayment): void {
    console.log('Incomplete payment found:', payment);
    // Implement app-specific logic for handling incomplete payments
    // For example, resume the payment flow or notify the user
  }

  /**
   * Fetch the user's Pi token balance
   * In a real implementation, this would call a backend API that interfaces with Pi Network
   */
  public async fetchTokenBalance(): Promise<number> {
    if (!this._isAuthenticated) return 0;
    
    try {
      // In a real implementation, this would make an API call to fetch the actual balance
      // For now, we'll use a mock implementation
      if (process.env.NODE_ENV === 'development') {
        this._tokenBalance = 10; // Mock balance for development
      } else {
        // Replace this with actual API call in production
        // This could be a call to your backend which then queries Pi Network API
        // or a direct call to Pi Network API if available
        this._tokenBalance = 5; // Placeholder value
      }

      return this._tokenBalance;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }

  /**
   * Get the current user's token balance
   */
  public getTokenBalance(): number {
    return this._tokenBalance;
  }

  /**
   * Check if user has enough tokens to vote
   */
  public hasEnoughTokensToVote(): boolean {
    return this._tokenBalance >= MIN_TOKEN_BALANCE_TO_VOTE;
  }

  /**
   * Get the current authenticated user
   */
  public getUser(): PiUser | null {
    return this._user;
  }

  /**
   * Check if the user is authenticated
   */
  public isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}

// Export a singleton instance
export const PiNetwork = PiNetworkService.getInstance();

// Initialize the service
export const initPiNetwork = () => {
  PiNetwork.init();
};
