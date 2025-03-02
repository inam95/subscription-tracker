import { config } from 'dotenv';
import path from 'node:path';
import { z } from 'zod';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}.local`);

config({ path: envFilePath });

const envSchema = z.object({
  PORT: z.coerce
    .number()
    .default(5500)
    .describe('The port the application will run on'),
  NODE_ENV: z
    .string()
    .default('development')
    .describe('The environment the application is running in'),
  DB_URI: z.string().url().describe('The URI for the database connection'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid env:');
  console.error(JSON.stringify(parsedEnv.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export type TEnv = z.infer<typeof envSchema>;
export const env = parsedEnv.data;
