import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Uses Supabase Postgres connection string (Settings → Database → URI).
 * Never ship this URL in the mobile app; only drizzle-kit / CI use it locally.
 */
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
