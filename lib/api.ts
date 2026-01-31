/**
 * API client for backend Cloud Functions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://us-central1-warlord-1cbe3.cloudfunctions.net';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  cost?: number;
  method?: 'FREE' | 'CHEAP' | 'EXPENSIVE';
}

/**
 * Submit email for verification
 * Triggers FREE → CHEAP → EXPENSIVE cascade
 */
export async function submitEmail(email: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/submitEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('submitEmail error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify email token from magic link
 */
export async function verifyEmailToken(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/verifyEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('verifyEmailToken error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get company profile extraction status
 */
export async function getCompanyProfile(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/getCompanyProfile?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('getCompanyProfile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
