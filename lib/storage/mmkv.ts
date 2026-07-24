import { createMMKV } from 'react-native-mmkv';

const MMKV_ID = 'togetherly';

export const storage = createMMKV({ id: MMKV_ID });

export const StorageKeys = {
  userProfile: 'togetherly:userProfile',
  coupleSpace: 'togetherly:coupleSpace',
} as const;
