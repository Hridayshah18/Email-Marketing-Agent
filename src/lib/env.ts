const REQUIRED_SERVER_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GEMINI_API_KEY",
  "RESEND_API_KEY",
  "APP_URL",
  "DEFAULT_FROM_EMAIL",
  "DEFAULT_REPLY_TO_EMAIL",
  "ADMIN_PASSWORD",
] as const;

const OPTIONAL_SERVER_ENV = [
  "OPENAI_API_KEY",
  "RESEND_WEBHOOK_SECRET",
  "BRAND_LOGO_URL",
  "ADMIN_EMAIL",
  "ADMIN_EMAILS",
  "PUBLIC_DEMO_ENABLED",
] as const;

export function getRequiredEnvStatus() {
  return REQUIRED_SERVER_ENV.map((key) => ({
    key,
    exists: Boolean(process.env[key]),
    required: true,
  }));
}

export function getOptionalEnvStatus() {
  return OPTIONAL_SERVER_ENV.map((key) => ({
    key,
    exists: Boolean(process.env[key]),
    required: false,
  }));
}

export function getEnvStatus() {
  return [...getRequiredEnvStatus(), ...getOptionalEnvStatus()];
}

export function validateRequiredEnv() {
  const missing = getRequiredEnvStatus()
    .filter((item) => !item.exists)
    .map((item) => item.key);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

