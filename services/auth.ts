import { env } from '@/lib/env';

interface AuthResponse {
  token: string;
  expiresIn?: number;
}

// Module-level state
let token: string | null = null;
let tokenExpiry: number | null = null;

const baseUrl = env.PROPERFY_API_URL;

export async function login(
  username: string,
  password: string
): Promise<string> {
  const loginUrl = `${baseUrl}/api/auth/token`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vrcEmail: username,
      vrcPass: password,
    }),
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
  token = data.token;

  // Set expiry (default to 1 hour if not provided)
  const expiresInMs = (data.expiresIn || 3600) * 1000;
  tokenExpiry = Date.now() + expiresInMs;

  return data.token;
}

export function isTokenValid(): boolean {
  if (!token || !tokenExpiry) {
    return false;
  }
  // Check if token is expired (with 5 minute buffer)
  return Date.now() < tokenExpiry - 5 * 60 * 1000;
}

export async function getToken(): Promise<string> {
  // Return cached token if still valid
  if (isTokenValid() && token) {
    return token;
  }

  // Auto-login with env credentials
  if (env.PROPERFY_USERNAME && env.PROPERFY_PASSWORD) {
    return await login(env.PROPERFY_USERNAME, env.PROPERFY_PASSWORD);
  }

  throw new Error('No credentials available for authentication');
}

export function clearToken(): void {
  token = null;
  tokenExpiry = null;
}
