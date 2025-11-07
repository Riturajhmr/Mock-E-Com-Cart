import { useEffect, useState } from 'react'
import { fetchProducts, searchProducts } from '../services/productAPI'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(2)
  const navigate = useNavigate()
  const { add } = useCart()

  const { search } = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(search)
    const q = params.get('q')
    const loader = q ? searchProducts(q) : fetchProducts()
    loader
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [search])

  // Get featured products for hero section
  const featuredProduct = products.length > 0 ? products[0] : null
  const productThumbnails = products.slice(1, 4)

  const handleBuyNow = () => {
    if (featuredProduct) {
      add({ 
        product_id: featuredProduct._id || featuredProduct.Product_ID, 
        quantity: quantity 
      })
      navigate('/cart')
    }
  }

  const incrementQuantity = () => setQuantity(q => q + 1)
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#FFE5D9] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Side - Text Content */}
            <div className="space-y-8 z-10">
              {/* Main Title */}
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-[#FFB6C1] leading-tight">
                e-commerce Website
                </h1>
              
              {/* Slogan */}
              <p className="text-xl lg:text-2xl text-[#8B6F47] font-sans font-medium">
                SUPPORT LOCAL EVERYTHING
              </p>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Choose your</label>
                <div className="flex items-center gap-4 bg-white rounded-lg p-2 w-fit shadow-sm">
                  <button
                    onClick={decrementQuantity}
                    className="w-8 h-8 flex items-center justify-center text-[#8B6F47] hover:bg-[#FFE5D9] rounded transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="text-xl font-semibold text-gray-800 w-12 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="w-8 h-8 flex items-center justify-center text-[#8B6F47] hover:bg-[#FFE5D9] rounded transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
                Buy Now
              </button>
            </div>

            {/* Right Side - Product Display */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* Large Circular Product Image */}
            <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-[#FFE5D9] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                  {featuredProduct ? (
                    <img 
                      src={featuredProduct.image || `https://via.placeholder.com/400?text=${encodeURIComponent(featuredProduct.product_name || 'Product')}`}
                      alt={featuredProduct.product_name || 'Featured Product'}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#FFE5D9"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#8B6F47" text-anchor="middle" dy=".3em">${featuredProduct.product_name || 'Product'}</text></svg>`)}`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FFE5D9] to-[#FFD4C4] rounded-full flex items-center justify-center">
                      <span className="text-4xl text-[#8B6F47]">🪑</span>
                    </div>
                  )}
                  </div>
                  
                {/* Speech Bubble 1 - Minimalistic */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-md">
                  <p className="text-[#8B6F47] font-semibold text-sm">Minimalistic.</p>
                </div>

                {/* Speech Bubble 2 - Super cozy */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2 shadow-md">
                  <p className="text-[#8B6F47] font-semibold text-sm">¡Super cozy!</p>
                </div>
              </div>

              {/* Product Thumbnails - Stacked Vertically */}
              <div className="hidden lg:flex flex-col gap-4 ml-6">
                {productThumbnails.map((product, index) => (
                  <div
                    key={product._id || product.Product_ID || index}
                    className="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                  >
                        <img 
                      src={product.image || `https://via.placeholder.com/80?text=${encodeURIComponent(product.product_name || 'Product')}`}
                      alt={product.product_name || `Product ${index + 1}`}
                      className="w-full h-full object-cover"
                          onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#FFE5D9"/><text x="50%" y="50%" font-family="Arial" font-size="10" fill="#8B6F47" text-anchor="middle" dy=".3em">${product.product_name || 'P'}</text></svg>`)}`
                      }}
                    />
                  </div>
                ))}
                {productThumbnails.length === 0 && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-md border-2 border-white"></div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 shadow-md border-2 border-white"></div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 shadow-md border-2 border-white"></div>
                  </>
                )}
            </div>
          </div>
        </div>

          {/* Continue Shopping Link */}
          <div className="mt-8 lg:mt-12 flex justify-end">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="flex items-center gap-2 text-[#8B6F47] font-semibold hover:opacity-80 transition-opacity cursor-pointer"
            >
              Continue shopping
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">All Products</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B6F47] mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.Product_ID || p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
