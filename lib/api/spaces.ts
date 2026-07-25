import { apiFetch, parseJsonResponse } from '@/lib/api/http';

export type SpaceResponse = {
  id: string;
  inviteCode: string;
  ownerId: string;
  partnerId: string | null;
};

export const createSpace = () =>
  apiFetch('/spaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }).then(parseJsonResponse<SpaceResponse>);

export const joinSpace = (inviteCode: string) =>
  apiFetch('/spaces/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inviteCode }),
  }).then(parseJsonResponse<SpaceResponse>);

export const getSpace = (spaceId: string) =>
  apiFetch(`/spaces/${spaceId}`).then(parseJsonResponse<SpaceResponse>);

/** Stub — will be replaced with WebSocket/SSE when real-time is wired up. */
export function subscribeToPartnerJoined(
  _spaceId: string,
  _onJoined: () => void,
): (() => void) | null {
  return null;
}
