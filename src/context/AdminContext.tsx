'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product } from '@/data/products'

export type AdminProduct = Product

interface AdminContextType {
  adminProducts: AdminProduct[]
  addProduct: (product: AdminProduct) => void
  updateProduct: (id: string, product: AdminProduct) => void
  deleteProduct: (id: string) => void
  loadProductsFromDatabase: () => Promise<AdminProduct[]>
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const normalizeProduct = (raw: unknown): AdminProduct => {
    const rawObj: Record<string, unknown> =
      raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

    const rawPrice = rawObj.price
    const rawPriceObj: Record<string, unknown> =
      rawPrice && typeof rawPrice === 'object' ? (rawPrice as Record<string, unknown>) : {}
    const rawMin = rawPriceObj.min
    const rawMax = rawPriceObj.max

    const safeId = typeof rawObj.id === 'string' && rawObj.id ? rawObj.id : Date.now().toString()
    const safeName = typeof rawObj.name === 'string' ? rawObj.name : ''
    const safeBrand = typeof rawObj.brand === 'string' ? rawObj.brand : ''
    const safeCategory: AdminProduct['category'] =
      rawObj.category === 'men' || rawObj.category === 'women' || rawObj.category === 'unisex'
        ? rawObj.category
        : 'unisex'

    const safeSizes: string[] = Array.isArray(rawObj.sizes)
      ? rawObj.sizes
          .filter((s) => typeof s === 'string' && s.trim())
          .map((s) => (s as string).trim())
      : []

    const rawVariantPrices = rawObj.variantPrices
    const safeVariantPrices: Record<string, number> | undefined =
      rawVariantPrices && typeof rawVariantPrices === 'object' && !Array.isArray(rawVariantPrices)
        ? Object.fromEntries(
            Object.entries(rawVariantPrices as Record<string, unknown>)
              .filter((entry): entry is [string, number] => {
                const [k, v] = entry
                return typeof k === 'string' && typeof v === 'number' && Number.isFinite(v)
              })
          )
        : undefined

    const fallbackMin = typeof rawMin === 'number' && Number.isFinite(rawMin) ? rawMin : 0
    const fallbackMax = typeof rawMax === 'number' && Number.isFinite(rawMax) ? rawMax : fallbackMin

    const derivedVariantPrices: Record<string, number> | undefined =
      safeVariantPrices ??
      (safeSizes.length > 0
        ? Object.fromEntries(safeSizes.map((size) => [size, fallbackMin]))
        : undefined)

    const prices = derivedVariantPrices ? Object.values(derivedVariantPrices) : []
    const derivedMin = prices.length > 0 ? Math.min(...prices) : fallbackMin
    const derivedMax = prices.length > 0 ? Math.max(...prices) : fallbackMax

    const finalSizes =
      safeSizes.length > 0 ? safeSizes : derivedVariantPrices ? Object.keys(derivedVariantPrices) : []

    return {
      id: safeId,
      name: safeName,
      brand: safeBrand,
      category: safeCategory,
      price: {
        min: Number.isFinite(derivedMin) ? derivedMin : 0,
        max: Number.isFinite(derivedMax) ? derivedMax : 0,
      },
      image: typeof rawObj.image === 'string' && rawObj.image ? rawObj.image : '/placeholder.jpg',
      description: typeof rawObj.description === 'string' ? rawObj.description : '',
      notes: Array.isArray(rawObj.notes) ? rawObj.notes.filter((n) => typeof n === 'string') : [],
      isHot: typeof rawObj.isHot === 'boolean' ? rawObj.isHot : false,
      sizes: finalSizes,
      variantPrices: derivedVariantPrices,
      inStock: typeof rawObj.inStock === 'boolean' ? rawObj.inStock : true,
    }
  }

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('adminProducts')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setAdminProducts(parsed.map(normalizeProduct))
        } else {
          setAdminProducts([])
        }
      } catch (e) {
        console.error('Failed to load admin products:', e)
      }
    }

    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setIsAdmin(true)
    }
  }, [])

  const syncCodebase = async () => {
    try {
      const response = await fetch('/api/db/products/sync-codebase', {
        method: 'POST',
      })
      if (!response.ok) {
        console.error('Failed to sync codebase')
      }
    } catch (error) {
      console.error('Error syncing codebase:', error)
    }
  }

  const loadProductsFromDatabase = async () => {
    try {
      const response = await fetch('/api/db/products')
      if (response.ok) {
        const data = await response.json()
        if (data.products && Array.isArray(data.products)) {
          const normalizedProducts = data.products.map(normalizeProduct)
          setAdminProducts(normalizedProducts)
          localStorage.setItem('adminProducts', JSON.stringify(normalizedProducts))
          return normalizedProducts
        }
      }
    } catch (error) {
      console.error('Error loading products from database:', error)
    }
    return []
  }

  const addProduct = async (product: AdminProduct) => {
    try {
      const normalizedProduct = normalizeProduct(product)
      
      // Save to MongoDB
      const response = await fetch('/api/db/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedProduct),
      })

      if (!response.ok) {
        throw new Error('Failed to save product to database')
      }

      const data = await response.json()
      
      // Update local state
      const newProducts = [...adminProducts, normalizedProduct]
      setAdminProducts(newProducts)
      localStorage.setItem('adminProducts', JSON.stringify(newProducts))

      // Sync codebase
      await syncCodebase()
      
      return data
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, product: AdminProduct) => {
    try {
      const normalizedProduct = { ...normalizeProduct(product), id }
      
      // Update in MongoDB
      const response = await fetch('/api/db/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedProduct),
      })

      if (!response.ok) {
        throw new Error('Failed to update product in database')
      }

      // Update local state
      const newProducts = adminProducts.map((p) => (p.id === id ? normalizedProduct : p))
      setAdminProducts(newProducts)
      localStorage.setItem('adminProducts', JSON.stringify(newProducts))

      // Sync codebase
      await syncCodebase()
      
      return response.json()
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      // Delete from MongoDB
      const response = await fetch('/api/db/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete product from database')
      }

      // Update local state
      const newProducts = adminProducts.filter((p) => p.id !== id)
      setAdminProducts(newProducts)
      localStorage.setItem('adminProducts', JSON.stringify(newProducts))

      // Sync codebase
      await syncCodebase()
      
      return response.json()
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  return (
    <AdminContext.Provider value={{ adminProducts, addProduct, updateProduct, deleteProduct, loadProductsFromDatabase, isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
