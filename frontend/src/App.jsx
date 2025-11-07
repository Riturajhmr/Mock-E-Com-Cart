import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './routes/ProtectedRoute'
import SimpleCheckout from './pages/SimpleCheckout'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><SimpleCheckout /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
