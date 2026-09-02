import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  AUTH_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  //RESEND_API_KEY: z.string().optional(),
  //RESEND_FROM_EMAIL: z.string().email().optional(),
  SUPERUSER_EMAILS: z.string().optional(), // comma-separated
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
