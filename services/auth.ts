import { env } from '@/lib/env';

interface AuthResponse {
  token: string;
  expiresIn?: number;
}

class AuthService {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.baseUrl = env.PROPERFY_API_URL;
  }

  async login(username: string, password: string): Promise<string> {
    const loginUrl = `${this.baseUrl}/api/auth/token`;

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vrcEmail: username,
        vrcPass: password
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage = `Login failed: ${response.statusText} (${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use the text
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    const data: AuthResponse = await response.json();
    this.token = data.token;

    // Set expiry (default to 1 hour if not provided)
    const expiresInMs = (data.expiresIn || 3600) * 1000;
    this.tokenExpiry = Date.now() + expiresInMs;

    return data.token;
  }

  isTokenValid(): boolean {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }
    // Check if token is expired (with 5 minute buffer)
    return Date.now() < (this.tokenExpiry - 5 * 60 * 1000);
  }

  async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.isTokenValid() && this.token) {
      return this.token;
    }

    // Auto-login with env credentials
    if (env.PROPERFY_USERNAME && env.PROPERFY_PASSWORD) {
      return await this.login(env.PROPERFY_USERNAME, env.PROPERFY_PASSWORD);
    }

    throw new Error('No credentials available for authentication');
  }

  clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
  }
}

export const authService = new AuthService();
