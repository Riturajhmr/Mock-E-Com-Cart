const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Validate email configuration before creating transporter
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate HTML email template for order confirmation
const generateOrderEmailTemplate = (orderDetails) => {
  const { userName, orderId, items, total, timestamp, email } = orderDetails;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name || 'Product'}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * (item.quantity || 1)).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Order Confirmation</h1>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
        <p style="font-size: 16px;">Hello <strong>${userName}</strong>,</p>
        
        <p>Thank you for your order! We're excited to confirm that your order has been placed successfully.</p>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
          <h2 style="color: #000; margin-top: 0;">Order Details</h2>
          
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Order Date:</strong> ${formatDate(timestamp)}</p>
          <p><strong>Email:</strong> ${email}</p>
          
          <h3 style="color: #000; margin-top: 20px;">Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 18px; font-weight: bold;">Total Amount:</span>
              <span style="font-size: 24px; font-weight: bold; color: #000;">$${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <p style="margin-top: 20px;">We'll send you another email when your order ships.</p>
        
        <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Vibe Commerce Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (orderDetails) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Email not configured. Skipping email notification.');
      console.log('📧 Order details that would be sent:', {
        to: orderDetails.email,
        orderId: orderDetails.orderId,
        total: orderDetails.total
      });
      return { success: false, message: 'Email not configured' };
    }

    // Validate email address
    if (!orderDetails.email || !orderDetails.email.includes('@')) {
      console.log('⚠️ Invalid email address. Skipping email notification.');
      return { success: false, message: 'Invalid email address' };
    }

    let transporter;
    try {
      transporter = createTransporter();
    } catch (transporterError) {
      console.error('❌ Error creating email transporter:', transporterError.message);
      return { success: false, error: 'Failed to create email transporter' };
    }
    
    const mailOptions = {
      from: `"Vibe Commerce" <${process.env.EMAIL_USER}>`,
      to: orderDetails.email,
      subject: `Order Confirmation - Order #${orderDetails.orderId}`,
      html: generateOrderEmailTemplate(orderDetails)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    console.log('📧 Email sent to:', orderDetails.email);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
    // Don't throw error - email failure shouldn't break checkout
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail
};

