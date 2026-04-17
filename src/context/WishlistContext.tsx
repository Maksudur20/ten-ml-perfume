'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/data/products'

interface WishlistContextType {
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      try {
        setWishlist(JSON.parse(saved))
      } catch {
        setWishlist([])
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, mounted])

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) return prev
      return [...prev, product]
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
