import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  PORT: z.number().default(4000),
});

export const config = configSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
}); 