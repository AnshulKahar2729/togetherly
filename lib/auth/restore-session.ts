import { refreshSessionApi } from '@/lib/api/auth';
import { fetchMe } from '@/lib/api/users';
import { clearAuthTokens, getRefreshToken } from '@/lib/storage/auth-session';
import { saveUserProfile, userProfileFromResponse } from '@/lib/storage/user-profile';

/** Restores tokens and local profile cache when a refresh token exists. */
export async function restoreSession(): Promise<boolean> {
  const refresh = await getRefreshToken();
  if (!refresh) return false;
  if (!(await refreshSessionApi())) return false;
  try {
    const user = await fetchMe();
    saveUserProfile(userProfileFromResponse(user));
    return true;
  } catch {
    await clearAuthTokens();
    return false;
  }
}
