// Simple test script for nodemailer
// Run with: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Email not configured in .env file');
    console.log('Please add:');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASS=your-app-password');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email options
  const mailOptions = {
    from: `"Vibe Commerce" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to yourself for testing
    subject: 'Test Email from Nodemailer',
    html: `
      <h1>Test Email</h1>
      <p>This is a test email from your e-commerce backend.</p>
      <p>If you received this, nodemailer is working correctly! ✅</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();

