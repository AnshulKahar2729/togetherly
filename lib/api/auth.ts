import { config } from '@/lib/config';
import { clearAuthTokens, getRefreshToken, saveAuthTokens } from '@/lib/storage/auth-session';

import type { UserResponse } from './types';

type OtpRequestResponse = { ok: true };

async function parseAuthJson<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({})) as { data?: T; error?: { message?: string } };
  if (!res.ok) throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  if (body.data === undefined) throw new Error('Invalid response');
  return body.data;
}

export async function requestOtp(email: string): Promise<void> {
  const res = await fetch(`${config.apiBaseUrl}/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  await parseAuthJson<OtpRequestResponse>(res);
}

export type VerifyOtpResult = {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
};

export async function verifyOtp(email: string, code: string): Promise<VerifyOtpResult> {
  const res = await fetch(`${config.apiBaseUrl}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  return parseAuthJson<VerifyOtpResult>(res);
}

/** Raw refresh call (no Bearer). Clears tokens on failure. */
export async function refreshSessionApi(): Promise<boolean> {
  const refresh = await getRefreshToken();
  if (!refresh) return false;
  const res = await fetch(`${config.apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) {
    await clearAuthTokens();
    return false;
  }
  try {
    const data = await parseAuthJson<{ accessToken: string; refreshToken: string }>(res);
    await saveAuthTokens(data);
    return true;
  } catch {
    await clearAuthTokens();
    return false;
  }
}
