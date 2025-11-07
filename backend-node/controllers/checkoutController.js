const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// POST /api/checkout - Mock checkout with receipt {cartItems} → {total, timestamp}
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { cartItems } = req.body; // Optional: can use cartItems from body or get from user's cart

    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Use cartItems from body if provided, otherwise use user's cart
    const itemsToCheckout = cartItems || user.usercart;

    if (!itemsToCheckout || itemsToCheckout.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate pricing details
    const subtotal = itemsToCheckout.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);

    const discountRate = 0.2; // 20% discount
    const deliveryFee = 15; // Flat delivery fee
    const discount = parseFloat((subtotal * discountRate).toFixed(2));
    const total = parseFloat((subtotal - discount + deliveryFee).toFixed(2));

    // Create order
    const order = {
      order_list: itemsToCheckout,
      ordered_on: new Date(),
      total_price: total,
      discount,
      pricing: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountRate,
        discount,
        deliveryFee,
        total
      },
      payment_method: {
        digital: false,
        cod: true
      },
      status: 'completed'
    };

    // Add order to user's orders
    user.orders.push(order);

    // Clear cart
    user.usercart = [];

    await user.save();

    const receipt = {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountRate,
      discount,
      deliveryFee,
      total,
      timestamp: new Date().toISOString(),
      order_id: order._id,
      items: itemsToCheckout.length
    };

    console.log('✅ Checkout Receipt:', JSON.stringify(receipt, null, 2));

    // Send order confirmation email (non-blocking - won't break checkout if it fails)
    try {
      const userName = `${user.first_name} ${user.last_name}`.trim();
      const orderId = order._id ? order._id.toString() : receipt.order_id || 'N/A';
      const emailResult = await sendOrderConfirmationEmail({
        userName: userName,
        email: user.email,
        orderId: orderId,
        items: itemsToCheckout,
        total,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount,
        deliveryFee,
        timestamp: receipt.timestamp
      });

      if (emailResult.success) {
        console.log('📧 Order confirmation email sent successfully');
      } else {
        console.log('⚠️ Email notification skipped:', emailResult.message || emailResult.error);
      }
    } catch (emailError) {
      // Email errors should not break checkout
      console.error('⚠️ Email notification error (non-critical):', emailError.message);
    }

    res.json(receipt);
  } catch (error) {
    console.error('Error processing checkout:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process checkout',
      message: error.message || 'Unknown error'
    });
  }
};

