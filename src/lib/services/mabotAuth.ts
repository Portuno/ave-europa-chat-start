import { Token, LoginCredentials } from '../types/mabot';

class MabotAuthService {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.baseUrl = import.meta.env.MABOT_API_URL || '';
    
    // Debug logging
    console.log('MABOT Auth Service initialized with baseUrl:', this.baseUrl);
    
    if (!this.baseUrl) {
      console.error('MABOT_API_URL is not configured! Please set it in your .env.local file');
    }
    
    this.loadTokensFromStorage();
    this.autoLoginIfNeeded();
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('mabot_access_token');
      this.refreshToken = localStorage.getItem('mabot_refresh_token');
      const expiry = localStorage.getItem('mabot_token_expiry');
      this.tokenExpiry = expiry ? parseInt(expiry) : null;
    }
  }

  private saveTokensToStorage(token: Token): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mabot_access_token', token.access_token);
      localStorage.setItem('mabot_refresh_token', token.refresh_token);
      // Set expiry to 1 hour from now (assuming tokens expire in 1 hour)
      const expiry = Date.now() + (60 * 60 * 1000);
      localStorage.setItem('mabot_token_expiry', expiry.toString());
      
      this.accessToken = token.access_token;
      this.refreshToken = token.refresh_token;
      this.tokenExpiry = expiry;
    }
  }

  private clearTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mabot_access_token');
      localStorage.removeItem('mabot_refresh_token');
      localStorage.removeItem('mabot_token_expiry');
      
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
    }
  }

  async login(credentials: LoginCredentials): Promise<Token> {
    try {
      if (!this.baseUrl) {
        throw new Error('MABOT API URL not configured. Please set MABOT_API_URL in your .env.local file');
      }

      const loginUrl = `${this.baseUrl}/auth/login`;
      console.log('Attempting login to:', loginUrl);
      
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('grant_type', credentials.grant_type || 'password');
      if (credentials.scope) formData.append('scope', credentials.scope);
      if (credentials.client_id) formData.append('client_id', credentials.client_id);
      if (credentials.client_secret) formData.append('client_secret', credentials.client_secret);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || `Login failed: ${response.status}`);
      }

      const token: Token = await response.json();
      this.saveTokensToStorage(token);
      return token;
    } catch (error) {
      console.error('MABOT login error:', error);
      throw error;
    }
  }

  async refreshTokens(): Promise<Token> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const token: Token = await response.json();
      this.saveTokensToStorage(token);
      return token;
    } catch (error) {
      console.error('MABOT token refresh error:', error);
      this.clearTokensFromStorage();
      throw error;
    }
  }

  getAccessToken(): string | null {
    // Check if token is expired or will expire soon (within 5 minutes)
    if (this.tokenExpiry && Date.now() > (this.tokenExpiry - 5 * 60 * 1000)) {
      return null; // Token expired or will expire soon
    }
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    this.clearTokensFromStorage();
  }

  private async autoLoginIfNeeded(): Promise<void> {
    // Only auto-login if we have credentials in environment and no valid token
    if (!this.isAuthenticated()) {
      const email = import.meta.env.MABOT_EMAIL;
      const password = import.meta.env.MABOT_PASSWORD;
      
      if (email && password) {
        try {
          await this.login({ username: email, password, grant_type: 'password' });
        } catch (error) {
          console.warn('Auto-login failed:', error);
        }
      }
    }
  }

  async ensureValidToken(): Promise<string> {
    let token = this.getAccessToken();
    
    if (!token) {
      // Try auto-login first if we have credentials
      try {
        await this.autoLoginIfNeeded();
        token = this.getAccessToken();
      } catch (error) {
        // Auto-login failed, try refresh if available
        if (this.refreshToken) {
          try {
            await this.refreshTokens();
            token = this.getAccessToken();
          } catch (refreshError) {
            // Refresh failed, need to login again
            throw new Error('Authentication required. Please login again.');
          }
        } else {
          throw new Error('Authentication required. Please login first.');
        }
      }
    }

    if (!token) {
      throw new Error('Failed to obtain valid access token');
    }

    return token;
  }
}

// Create singleton instance
export const mabotAuthService = new MabotAuthService();
export default mabotAuthService; 