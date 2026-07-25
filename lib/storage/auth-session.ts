import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'togetherly:accessToken';
const REFRESH_KEY = 'togetherly:refreshToken';

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}

export async function saveAuthTokens(tokens: { accessToken: string; refreshToken: string }): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken);
}

export async function clearAuthTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
  } catch {
    /* no-op */
  }
  try {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch {
    /* no-op */
  }
}
