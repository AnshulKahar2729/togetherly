import { config } from '@/lib/config';

export type UserResponse = {
  id: string;
  name: string;
  gender: 'woman' | 'man';
  avatarSeed: string;
  spaceId: string | null;
};

type CreateUserInput = {
  name: string;
  gender: 'woman' | 'man';
  avatarSeed: string;
};

type UpdateUserInput = Partial<CreateUserInput>;

async function parseResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({})) as { data?: T; error?: { message?: string } };
  if (!res.ok) throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  return body.data as T;
}

export const createUser = (input: CreateUserInput) =>
  fetch(`${config.apiBaseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then(parseResponse<UserResponse>);

export const updateUser = (userId: string, input: UpdateUserInput) =>
  fetch(`${config.apiBaseUrl}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).then(parseResponse<UserResponse>);

export const getUser = (userId: string) =>
  fetch(`${config.apiBaseUrl}/users/${userId}`).then(parseResponse<UserResponse>);
