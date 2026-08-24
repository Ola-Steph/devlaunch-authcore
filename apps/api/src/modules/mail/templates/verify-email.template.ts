export const verifyEmailTemplate = (
  verificationLink: string,
) => ({
  subject: "Verify your email address",

  text: `Verify your email by clicking the link below:

${verificationLink}`,

  html: `
    <h2>Verify Your Email</h2>

    <p>Welcome to AuthCore!</p>

    <p>Please verify your email by clicking the link below.</p>

    <p>
      <a href="${verificationLink}">
        Verify Email
      </a>
    </p>

    <p>
      If you didn't create this account,
      you can safely ignore this email.
    </p>
  `,
});