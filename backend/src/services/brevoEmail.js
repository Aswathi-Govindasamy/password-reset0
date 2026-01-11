import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

// Attach API key
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
console.log(
  "BREVO_API_KEY AT RUNTIME:",
  process.env.BREVO_API_KEY ? "LOADED" : "MISSING"
);


// ✅ EXPORT NAME MUST MATCH
export const sendResetEmail = async (email, resetLink) => {
  await apiInstance.sendTransacEmail({
    sender: {
      name: "Password Reset",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email }],
    subject: "Reset Your Password",
    htmlContent: `
      <p>You requested a password reset.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
};
