import { z } from 'zod';

import { storage, StorageKeys } from './mmkv';

const LocalCoupleSpaceSchema = z.object({
  inviteCode: z.string(),
  role: z.enum(['owner', 'member']),
});

export type LocalCoupleSpace = z.infer<typeof LocalCoupleSpaceSchema>;

function parseCoupleSpace(raw: string): LocalCoupleSpace | null {
  try {
    const result = LocalCoupleSpaceSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveLocalCoupleSpace(state: LocalCoupleSpace): void {
  storage.set(StorageKeys.coupleSpace, JSON.stringify(state));
}

export function loadLocalCoupleSpace(): LocalCoupleSpace | null {
  const raw = storage.getString(StorageKeys.coupleSpace);
  return raw ? parseCoupleSpace(raw) : null;
}
