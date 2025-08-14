import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'vishnushaji179@gmail.com',
    pass: 'rdxxzcfuftuigdkl',
  },
});

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: '"FinanceAI" <vishnushaji179@gmail.com>',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export function generateVerificationEmail(verificationLink: string, firstName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - FinanceAI</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 300; }
        .content { padding: 40px 30px; }
        .welcome { font-size: 24px; color: #333; margin-bottom: 20px; }
        .message { font-size: 16px; line-height: 1.8; margin-bottom: 30px; color: #555; }
        .button { display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: transform 0.3s ease; }
        .button:hover { transform: translateY(-2px); }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .security-note { background: #e8f4f8; border-left: 4px solid #17a2b8; padding: 20px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 FinanceAI</h1>
          <p style="margin: 0; opacity: 0.9;">AI-Powered Personal Finance Assistant</p>
        </div>
        <div class="content">
          <div class="welcome">Welcome${firstName ? ` ${firstName}` : ''}! 👋</div>
          <div class="message">
            Thank you for joining FinanceAI! We're excited to help you take control of your finances with AI-powered insights.
            <br><br>
            To get started and unlock all features, please verify your email address by clicking the button below:
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" class="button">✅ Verify Email Address</a>
          </div>
          <div class="security-note">
            <strong>🔐 Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create this account, please ignore this email.
          </div>
        </div>
        <div class="footer">
          <p><strong>FinanceAI</strong> - Your AI-powered finance companion</p>
          <p>This email was sent to your registered email address. If you have questions, contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmail(resetLink: string, firstName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - FinanceAI</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 300; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; color: #333; margin-bottom: 20px; }
        .message { font-size: 16px; line-height: 1.8; margin-bottom: 30px; color: #555; }
        .button { display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: transform 0.3s ease; }
        .button:hover { transform: translateY(-2px); }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .security-note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 FinanceAI</h1>
          <p style="margin: 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        <div class="content">
          <div class="title">Reset Your Password 🔑</div>
          <div class="message">
            ${firstName ? `Hi ${firstName},` : 'Hello,'}<br><br>
            We received a request to reset your FinanceAI password. Click the button below to create a new password:
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" class="button">🔄 Reset Password</a>
          </div>
          <div class="security-note">
            <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour for security reasons. If you didn't request this reset, please ignore this email and your password will remain unchanged.
          </div>
        </div>
        <div class="footer">
          <p><strong>FinanceAI</strong> - Your AI-powered finance companion</p>
          <p>This email was sent to your registered email address. For security questions, contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}