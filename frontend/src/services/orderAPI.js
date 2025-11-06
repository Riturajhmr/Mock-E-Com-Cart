import api from '../lib/api'

export const placeOrder = async (cartItems) => {
  // Assignment requirement: POST /api/checkout with {cartItems} → {total, timestamp}
  console.log('📦 Sending checkout request with cartItems:', cartItems)
  const { data } = await api.post('/checkout', { cartItems })
  console.log('✅ Checkout Receipt Received:', JSON.stringify(data, null, 2))
  return data
}

export const instantBuy = async (productId, quantity) => {
  // Use the modern /cart/instantbuy endpoint
  const { data } = await api.post('/cart/instantbuy', { 
    product_id: productId, 
    quantity: quantity 
  })
  return data
}

export const getOrders = async () => {
  const { data } = await api.get('/orders')
  return data
}

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`)
  return data
}


