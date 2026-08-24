import { ApiError } from "../../../common/errors/ApiError.js";
import { logger } from "../../../common/logger/logger.js";
import { env } from "../../../common/config/index.js";

import { transporter } from "../providers/nodemailer.provider.js";

export const mailService = {
  isEnabled() {
    return env.EMAIL_ENABLED;
  },

  isConfigured() {
    return Boolean(
      env.EMAIL_ENABLED &&
        env.SMTP_HOST &&
        env.SMTP_PORT &&
        env.SMTP_USER &&
        env.SMTP_PASS &&
        env.SMTP_FROM,
    );
  },

  async send(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    if (!env.EMAIL_ENABLED) {
      logger.info(
        {
          recipient: options.to,
          subject: options.subject,
        },
        "Email sending disabled; skipping email",
      );

      return;
    }

    if (!this.isConfigured()) {
      throw new ApiError(
        503,
        "Email service is not configured",
      );
    }

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      logger.error(
        {
          error,
          recipient: options.to,
          subject: options.subject,
        },
        "Failed to send email",
      );

      throw new ApiError(
        503,
        "Email service is currently unavailable",
      );
    }
  },
};