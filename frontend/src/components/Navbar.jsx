"use client"

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const onLogout = async () => {
    await logout()
    navigate('/login')
  }

  const onSearch = (event) => {
    event.preventDefault()
    if (!q.trim()) return
    navigate(`/?q=${encodeURIComponent(q.trim())}`)
  }

  const cartCount = Array.isArray(items)
    ? items.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0

  const displayName = user?.first_name
    ? `Hi, ${user.first_name}`
    : user?.email
    ? `Hi, ${user.email.split('@')[0]}`
    : 'Hi there'

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand Logo - House with Heart */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {/* House outline */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            {/* Heart inside */}
            <path d="M12 9c-1.1 0-2 .9-2 2 0 1.5 2 3.5 2 3.5s2-2 2-3.5c0-1.1-.9-2-2-2z" fill="currentColor" />
          </svg>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-800 hover:text-[#8B6F47] transition-colors font-medium cursor-pointer">
            Home
          </Link>
          <Link to="/" className="relative text-gray-800 hover:text-[#8B6F47] transition-colors font-medium cursor-pointer">
            Product
            <span className="absolute -top-2 -right-6 bg-[#FFE5D9] text-[#8B6F47] text-[10px] px-2 py-0.5 rounded-full font-semibold">New</span>
          </Link>
          <Link to="/" className="text-gray-800 hover:text-[#8B6F47] transition-colors font-medium cursor-pointer">
            About
          </Link>
          <Link to="/" className="text-gray-800 hover:text-[#8B6F47] transition-colors font-medium cursor-pointer">
            Contact
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center gap-3">
          <form onSubmit={onSearch} className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type here"
              className="w-48 pl-4 pr-10 py-2.5 bg-[#FFE5D9] border-none rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 text-sm"
            />
            <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <svg className="h-5 w-5 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 text-[#8B6F47] hover:opacity-80 transition-colors cursor-pointer">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Icon */}
          {token ? (
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-[#8B6F47] whitespace-nowrap">
                {displayName}
              </span>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium cursor-pointer text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-[#8B6F47] transition-colors font-medium cursor-pointer text-sm">
                Sign in
              </Link>
              <Link to="/signup" className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
