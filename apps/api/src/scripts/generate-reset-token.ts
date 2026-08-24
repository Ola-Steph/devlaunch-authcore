import "dotenv/config";

import {
  connectDatabase,
  disconnectDatabase,
} from "../common/database/mongoose.js";

import { UserModel } from "../modules/users/index.js";

import { resetToken } from "../common/security/reset-token.js";
import { env } from "../common/config/index.js";

const email = process.argv[2];

if (!email) {
  console.error(
    "Usage: pnpm exec tsx src/scripts/generate-reset-token.ts <email>",
  );

  process.exit(1);
}

try {
  await connectDatabase();

  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    console.error(`No user found with email: ${email}`);

    await disconnectDatabase();

    process.exitCode = 1;

    process.exit();
  }

  const rawToken = resetToken.generate();

  const hashedToken = resetToken.hash(rawToken);

const expiresAt = new Date(
  Date.now() +
    env.PASSWORD_RESET_TOKEN_TTL_MINUTES *
      60 *
      1000,
);

  await UserModel.findByIdAndUpdate(user._id, {
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: expiresAt,
  });

  console.log("\n========================================");
  console.log("PASSWORD RESET TEST TOKEN");
  console.log("========================================");

  console.log(`User: ${user.email}`);
  console.log(`Expires: ${expiresAt.toISOString()}`);

  console.log("\nRAW TOKEN:");
  console.log(rawToken);

  console.log("\n========================================\n");

  await disconnectDatabase();
} catch (error) {
  console.error(
    "Failed to generate reset token:",
    error,
  );

  process.exitCode = 1;
}