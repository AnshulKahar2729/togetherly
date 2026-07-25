import { z } from 'zod';

import type { UserResponse } from '@/lib/api/types';

import { storage, StorageKeys } from './mmkv';

const UserProfileSchema = z.object({
  id: z.string(),
  email: z.union([z.string().email(), z.null()]).optional(),
  name: z.string(),
  gender: z.enum(['woman', 'man']),
  avatarSeed: z.string(),
  spaceId: z.string().nullable(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export function userProfileFromResponse(user: UserResponse): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    avatarSeed: user.avatarSeed,
    spaceId: user.spaceId,
  };
}

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = storage.getString(StorageKeys.userProfile);
    if (!raw) return null;
    const result = UserProfileSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  storage.set(StorageKeys.userProfile, JSON.stringify(profile));
}
