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
  JWT_EXPIRE: Joi.string().default("24h"),
  JWT_REFRESH_SECRET: Joi.string().min(12).default(DEFAULT_REFRESH_SECRET),
  SMTP_HOST: Joi.string().allow("").default(""),
  SMTP_PORT: Joi.number().port().default(587),
  SMTP_USER: Joi.string().allow("").default(""),
  SMTP_PASS: Joi.string().allow("").default(""),
  STRIPE_SECRET_KEY: Joi.string().allow("").default(""),
  STRIPE_WEBHOOK_SECRET: Joi.string().allow("").default(""),
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

    if ((value.STRIPE_SECRET_KEY && !value.STRIPE_WEBHOOK_SECRET) || (!value.STRIPE_SECRET_KEY && value.STRIPE_WEBHOOK_SECRET)) {
      return helpers.error("any.custom", {
        message: "STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be provided together"
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

const corsOrigins = value.CORS_ORIGIN === "*"
  ? "*"
  : value.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

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
  smtpHost: value.SMTP_HOST,
  smtpPort: value.SMTP_PORT,
  smtpUser: value.SMTP_USER,
  smtpPass: value.SMTP_PASS,
  stripeSecretKey: value.STRIPE_SECRET_KEY,
  stripeWebhookSecret: value.STRIPE_WEBHOOK_SECRET,
  corsOrigins,
  bodyLimit: value.BODY_LIMIT,
  trustProxy: value.TRUST_PROXY,
  gracefulShutdownTimeoutMs: value.GRACEFUL_SHUTDOWN_TIMEOUT_MS
};

export default env;
