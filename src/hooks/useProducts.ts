'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Product } from '@/data/products'

interface UseProductsOptions {
  category?: string
  refetch?: boolean
}

export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Increment request ID to handle race conditions
      const currentRequestId = ++requestIdRef.current

      // Fetch from API with cache busting
      const queryParams = new URLSearchParams()
      if (options?.category) {
        queryParams.append('category', options.category)
      }
      // Add timestamp to prevent caching
      queryParams.append('_t', Date.now().toString())

      const response = await fetch(`/api/products?${queryParams.toString()}`, {
        cache: 'no-store', // Prevent browser caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })

      // Only update state if this is still the latest request
      if (currentRequestId !== requestIdRef.current) {
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Normalize MongoDB documents to Product interface
      const normalizedProducts = (data.data || []).map((p: any) => ({
        id: p._id || p.id || Date.now().toString(),
        name: p.name || '',
        brand: p.brand || '',
        category: p.category || 'unisex',
        price: p.price || { min: 0, max: 0 },
        image: p.image || '/placeholder.jpg',
        description: p.description || '',
        notes: p.notes || [],
        isHot: p.isHot || false,
        sizes: p.sizes || [],
        variantPrices: p.variantPrices,
        inStock: p.inStock !== false,
      }))

      setProducts(normalizedProducts)
    } catch (err) {
      // Only update error if this is still the latest request
      if (requestIdRef.current === requestIdRef.current) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error fetching products:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [options?.category])

  // Fetch on mount and when category changes
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  }
}
