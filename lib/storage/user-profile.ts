import { z } from 'zod';

import { storage, StorageKeys } from './mmkv';

const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.enum(['woman', 'man']),
  avatarSeed: z.string(),
  spaceId: z.string().nullable(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

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
