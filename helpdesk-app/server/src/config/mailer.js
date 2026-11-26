import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Helpdesk Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your Helpdesk account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome to Helpdesk!</h2>
        <p>Please verify your email address to activate your account and log in.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Verify Email
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          This link expires in 24 hours. If you didn't create an account, ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
export const sendPasswordResetEmail = async (toEmail, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Helpdesk Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your Helpdesk password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Reset Password
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};