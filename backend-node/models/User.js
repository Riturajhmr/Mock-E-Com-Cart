const mongoose = require('mongoose');

const ProductUserSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  product_name: { type: String },
  price: { type: Number, required: true },
  rating: { type: Number },
  image: { type: String },
  quantity: { type: Number, default: 1 }
}, { _id: true });

const PaymentSchema = new mongoose.Schema({
  digital: { type: Boolean, default: false },
  cod: { type: Boolean, default: false }
});

const PricingSchema = new mongoose.Schema({
  subtotal: { type: Number },
  discountRate: { type: Number },
  discount: { type: Number },
  deliveryFee: { type: Number },
  total: { type: Number }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  order_list: [ProductUserSchema],
  ordered_on: { type: Date, default: Date.now },
  total_price: { type: Number, required: true },
  discount: { type: Number },
  pricing: PricingSchema,
  payment_method: PaymentSchema,
  status: { type: String }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 2, maxlength: 30 },
  last_name: { type: String, required: true, minlength: 2, maxlength: 30 },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  token: { type: String },
  refresh_token: { type: String },
  user_id: { type: String, unique: true },
  usercart: { type: [ProductUserSchema], default: [] },
  orders: { type: [OrderSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

