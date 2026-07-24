import { config } from '@/lib/config';

export type SpaceResponse = {
  id: string;
  inviteCode: string;
  ownerId: string;
  partnerId: string | null;
};

async function parseResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({})) as { data?: T; error?: { message?: string } };
  if (!res.ok) throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  return body.data as T;
}

export const createSpace = (userId: string) =>
  fetch(`${config.apiBaseUrl}/spaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  }).then(parseResponse<SpaceResponse>);

export const joinSpace = (userId: string, inviteCode: string) =>
  fetch(`${config.apiBaseUrl}/spaces/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, inviteCode }),
  }).then(parseResponse<SpaceResponse>);

export const getSpace = (spaceId: string) =>
  fetch(`${config.apiBaseUrl}/spaces/${spaceId}`).then(parseResponse<SpaceResponse>);

/** Stub — will be replaced with WebSocket/SSE when real-time is wired up. */
export function subscribeToPartnerJoined(
  _spaceId: string,
  _onJoined: () => void,
): (() => void) | null {
  return null;
}
