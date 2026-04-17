'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Heart, User, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  name: string
  brand: string
  price: { min: number; max: number }
}

export function Header() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const cartCount = cart.reduce((total: number, item) => total + item.quantity, 0)

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setSearchResults(data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setShowResults(false)
    }
  }

  const handleResultClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setShowResults(false)
    setSearchQuery('')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-burgundy-700">
      {/* Promo Banner */}
      <div className="bg-burgundy-900 text-white py-2 text-center text-sm">
        GET 100% AUTHENTIC PERFUME DECANT 3/5/10/15/30 ML SIZES IN BANGLADESH
      </div>

      {/* Main Header */}
      <div className="container-fluid py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo.svg" alt="10ML Perfume Logo" className="h-12 w-12" />
            <div className="hidden sm:block">
              <div className="text-2xl font-bold text-burgundy-700">10ML</div>
              <span className="text-sm text-burgundy-600">Perfume</span>
            </div>
          </Link>

          <div className="flex-1 mx-8 hidden md:flex relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="w-full px-4 py-2 border border-burgundy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-700 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setShowResults(false)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 bg-white border border-burgundy-200 rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="w-full text-left px-4 py-3 hover:bg-burgundy-50 transition border-b last:border-b-0 flex justify-between items-center group"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-burgundy-700">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                        <span className="text-sm font-semibold text-burgundy-700">
                          ৳{product.price.min}
                        </span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">No products found</div>
                )}
              </div>
            )}
          </div>


          <div className="flex items-center space-x-4">
            <a
              href="https://web.whatsapp.com/send?phone=8801580310965&text=Hi%20I%20want%20to%20know%20about%20your%20perfumes"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 btn-glass-dark px-4 py-2"
            >
              <span>💬</span>
              <span className="text-sm font-semibold">WhatsApp</span>
            </a>
            <button 
              className="text-gray-600 hover:text-burgundy-700 transition"
              aria-label="User account"
              title="User account"
            >
              <User size={20} />
            </button>
            <Link
              href="/wishlist"
              className="text-gray-600 hover:text-accent transition"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-burgundy-700 transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-3 text-burgundy-700 font-semibold">
          <Link href="/" className="btn-glass-light px-4 py-2">
            HOME
          </Link>
          <Link href="/shop" className="btn-glass-light px-4 py-2">
            SHOP
          </Link>
          <Link href="/about" className="btn-glass-light px-4 py-2">
            ABOUT
          </Link>
          <Link href="/contact" className="btn-glass-light px-4 py-2">
            CONTACT
          </Link>
        </nav>

        {/* Mobile Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-burgundy-50 border-t-2 border-burgundy-700 p-4 space-y-3">
          <Link href="/" className="block text-burgundy-700 hover:text-burgundy-900 font-semibold">
            HOME
          </Link>
          <Link href="/shop" className="block text-burgundy-700 hover:text-burgundy-900 font-semibold">
            SHOP
          </Link>
          <Link href="/about" className="block text-burgundy-700 hover:text-burgundy-900 font-semibold">
            ABOUT
          </Link>
          <Link href="/contact" className="block text-burgundy-700 hover:text-burgundy-900 font-semibold">
            CONTACT
          </Link>
          <Link href="/cart" className="block text-burgundy-700 hover:text-burgundy-900 font-semibold">
            CART ({cartCount})
          </Link>
        </nav>
      )}
    </header>
  )
}
