import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url('EXPO_PUBLIC_API_URL must be a valid URL'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Missing or invalid env variables:\n${parsed.error.message}`);
}

export const config = {
  apiBaseUrl: `${parsed.data.EXPO_PUBLIC_API_URL}/api`,
} as const;
