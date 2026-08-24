import {
  bool,
  cleanEnv,
  port,
  str,
} from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),

  PORT: port({
    default: 4000,
  }),

  MONGODB_URI: str(),

  JWT_ACCESS_SECRET: str(),

  JWT_REFRESH_SECRET: str(),

  JWT_ACCESS_EXPIRES_IN: str({
    default: "15m",
  }),

  JWT_REFRESH_EXPIRES_IN: str({
    default: "7d",
  }),

PASSWORD_RESET_TOKEN_TTL_MINUTES: port({
  default: 60,
}),

  CLIENT_URL: str({
    default: "http://localhost:3000",
  }),

  LOG_LEVEL: str({
    default: "info",
  }),


    /*
   * Email configuration
   *
   * EMAIL_ENABLED controls whether AuthCore
   * attempts to send email.
   *
   * false = email disabled
   * true  = email enabled
   */
  EMAIL_ENABLED: bool({
    default: false,
  }),
  

SMTP_HOST: str({
  default: "",
}),

SMTP_PORT: port({
  default: 587,
}),

SMTP_SECURE: bool({
  default: false,
}),

SMTP_USER: str({
  default: "",
}),

SMTP_PASS: str({
  default: "",
}),

SMTP_FROM: str({
  default: "",
}),

  EMAIL_VERIFICATION_TOKEN_TTL_MINUTES: port({
  default: 60 * 24,
}),


});