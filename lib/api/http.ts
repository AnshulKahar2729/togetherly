import { config } from '@/lib/config';
import { getAccessToken } from '@/lib/storage/auth-session';

import { refreshSessionApi } from './auth';

export async function parseJsonResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({})) as { data?: T; error?: { message?: string } };
  if (!res.ok) throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  if (body.data === undefined) throw new Error('Invalid response');
  return body.data;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${config.apiBaseUrl}${path}`;
  const headers = new Headers(init?.headers ?? undefined);
  let access = await getAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  let res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    const refreshed = await refreshSessionApi();
    if (refreshed) {
      access = await getAccessToken();
      if (access) headers.set('Authorization', `Bearer ${access}`);
      res = await fetch(url, { ...init, headers });
    }
  }
  return res;
}
