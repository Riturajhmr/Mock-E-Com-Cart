import api from '../lib/api'

export const placeOrder = async (cartItems) => {
  // Assignment requirement: POST /api/checkout with {cartItems} → {total, timestamp}
  console.log('📦 Sending checkout request with cartItems:', cartItems)
  const { data } = await api.post('/checkout', { cartItems })
  console.log('✅ Checkout Receipt Received:', JSON.stringify(data, null, 2))
  return data
}


