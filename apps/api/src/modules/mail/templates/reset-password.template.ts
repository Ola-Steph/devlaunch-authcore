export const resetPasswordTemplate = (
  resetLink: string,
) => ({
  subject: "Reset your password",

  text: `Reset your password using this link:

${resetLink}`,

  html: `
    <h2>Reset Password</h2>

    <p>You requested a password reset.</p>

    <p>
      <a href="${resetLink}">
        Reset Password
      </a>
    </p>

    <p>
      If you didn't request this,
      you can safely ignore this email.
    </p>
  `,
});