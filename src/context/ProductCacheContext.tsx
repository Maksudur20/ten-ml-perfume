'use client'

import React, { createContext, useContext, useCallback } from 'react'

interface ProductCacheContextType {
  invalidateProductCache: () => void
  triggerRefresh: boolean
}

const ProductCacheContext = createContext<ProductCacheContextType | undefined>(undefined)

export function ProductCacheProvider({ children }: { children: React.ReactNode }) {
  const [triggerRefresh, setTriggerRefresh] = React.useState(false)

  const invalidateProductCache = useCallback(() => {
    // Force a refresh by toggling the trigger state
    setTriggerRefresh((prev) => !prev)
  }, [])

  return (
    <ProductCacheContext.Provider value={{ invalidateProductCache, triggerRefresh }}>
      {children}
    </ProductCacheContext.Provider>
  )
}

export function useProductCache() {
  const context = useContext(ProductCacheContext)
  if (!context) {
    throw new Error('useProductCache must be used within ProductCacheProvider')
  }
  return context
}
