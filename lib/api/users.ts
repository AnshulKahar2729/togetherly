import { apiFetch, parseJsonResponse } from '@/lib/api/http';

import type { UserResponse } from './types';

export type { UserResponse } from './types';

type UpdateUserInput = {
  name?: string;
  gender?: 'woman' | 'man';
  avatarSeed?: string;
};

export async function fetchMe(): Promise<UserResponse> {
  const res = await apiFetch('/users/me');
  return parseJsonResponse<UserResponse>(res);
}

export async function updateProfileMe(input: UpdateUserInput): Promise<UserResponse> {
  const res = await apiFetch('/users/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseJsonResponse<UserResponse>(res);
}
