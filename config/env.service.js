import dotenv from "dotenv";
import Joi from "joi";

dotenv.config({ path: "./config/.env" });

const DEFAULT_JWT_SECRET = "super-secret-key";
const DEFAULT_REFRESH_SECRET = "refresh-secret-key";

const envSchema = Joi.object({
  PORT: Joi.number().port().default(5000),
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  APP_BASE_URL: Joi.string().uri().default("http://localhost:5000"),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(12).default(DEFAULT_JWT_SECRET),
  JWT_EXPIRE: Joi.string().default("1h"),
  JWT_REFRESH_SECRET: Joi.string().min(12).default(DEFAULT_REFRESH_SECRET),
  JWT_REFRESH_EXPIRE: Joi.string().default("7d"),
  FRONTEND_URL: Joi.string().uri().allow("").default(""),
  REFRESH_TOKEN_COOKIE_DOMAIN: Joi.string().allow("").default(""),
  SMTP_HOST: Joi.string().allow("").default(""),
  SMTP_PORT: Joi.number().port().default(587),
  SMTP_USER: Joi.string().allow("").default(""),
  SMTP_PASS: Joi.string().allow("").default(""),
  STRIPE_SECRET_KEY: Joi.string().allow("").default(""),
  STRIPE_WEBHOOK_SECRET: Joi.string().allow("").default(""),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow("").default(""),
  CLOUDINARY_API_KEY: Joi.string().allow("").default(""),
  CLOUDINARY_API_SECRET: Joi.string().allow("").default(""),
  CORS_ORIGIN: Joi.string().default("*"),
  BODY_LIMIT: Joi.string().default("2mb"),
  TRUST_PROXY: Joi.boolean().truthy("true").truthy("1").falsy("false").falsy("0").default(false),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: Joi.number().integer().min(1000).default(5000),
  GRACEFUL_SHUTDOWN_TIMEOUT_MS: Joi.number().integer().min(1000).default(10000)
})
  .custom((value, helpers) => {
    const smtpValues = [value.SMTP_HOST, value.SMTP_USER, value.SMTP_PASS].filter(Boolean);
    if (smtpValues.length > 0 && smtpValues.length < 3) {
      return helpers.error("any.custom", {
        message: "SMTP_HOST, SMTP_USER, and SMTP_PASS must be provided together"
      });
    }

    const cloudinaryValues = [value.CLOUDINARY_CLOUD_NAME, value.CLOUDINARY_API_KEY, value.CLOUDINARY_API_SECRET].filter(Boolean);
    if (cloudinaryValues.length > 0 && cloudinaryValues.length < 3) {
      return helpers.error("any.custom", {
        message: "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be provided together"
      });
    }

    if (value.NODE_ENV === "production") {
      if (value.JWT_SECRET === DEFAULT_JWT_SECRET) {
        return helpers.error("any.custom", {
          message: "JWT_SECRET must be changed before running in production"
        });
      }

      if (value.JWT_REFRESH_SECRET === DEFAULT_REFRESH_SECRET) {
        return helpers.error("any.custom", {
          message: "JWT_REFRESH_SECRET must be changed before running in production"
        });
      }

      if (!value.FRONTEND_URL && value.CORS_ORIGIN === "*") {
        return helpers.error("any.custom", {
          message: "FRONTEND_URL or a non-wildcard CORS_ORIGIN must be configured before running in production"
        });
      }
    }

    return value;
  }, "production validation")
  .messages({
    "any.custom": "{{#message}}"
  });

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true
});

if (error) {
  throw new Error(`Environment validation failed: ${error.details.map((detail) => detail.message).join(", ")}`);
}

const normalizeOrigin = (origin) => String(origin).trim().replace(/\/+$/, "");

const corsOrigins = value.FRONTEND_URL
  ? normalizeOrigin(value.FRONTEND_URL)
  : value.CORS_ORIGIN === "*"
  ? "*"
  : value.CORS_ORIGIN.split(",").map(normalizeOrigin).filter(Boolean);

const parseDurationToMs = (duration) => {
  const match = String(duration).trim().match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)$/i);
  if (!match) {
    throw new Error("JWT_REFRESH_EXPIRE must use ms, s, m, h, or d units, for example 7d");
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return Math.round(value * multipliers[unit]);
};

const env = {
  port: value.PORT,
  nodeEnv: value.NODE_ENV,
  isProduction: value.NODE_ENV === "production",
  isTest: value.NODE_ENV === "test",
  appBaseUrl: value.APP_BASE_URL,
  mongoUri: value.MONGODB_URI,
  mongoServerSelectionTimeoutMs: value.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
  jwtSecret: value.JWT_SECRET,
  jwtExpiresIn: value.JWT_EXPIRE,
  jwtRefreshSecret: value.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: value.JWT_REFRESH_EXPIRE,
  jwtRefreshMaxAgeMs: parseDurationToMs(value.JWT_REFRESH_EXPIRE),
  refreshTokenCookieDomain: value.REFRESH_TOKEN_COOKIE_DOMAIN || undefined,
  smtpHost: value.SMTP_HOST,
  smtpPort: value.SMTP_PORT,
  smtpUser: value.SMTP_USER,
  smtpPass: value.SMTP_PASS,
  stripeSecretKey: value.STRIPE_SECRET_KEY,
  stripeWebhookSecret: value.STRIPE_WEBHOOK_SECRET,
  cloudinaryCloudName: value.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: value.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: value.CLOUDINARY_API_SECRET,
  corsOrigins,
  bodyLimit: value.BODY_LIMIT,
  trustProxy: value.TRUST_PROXY,
  gracefulShutdownTimeoutMs: value.GRACEFUL_SHUTDOWN_TIMEOUT_MS,
  isCloudinaryConfigured: Boolean(
    value.CLOUDINARY_CLOUD_NAME
    && value.CLOUDINARY_API_KEY
    && value.CLOUDINARY_API_SECRET
  )
};

export default env;
