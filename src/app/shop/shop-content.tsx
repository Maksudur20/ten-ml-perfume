'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/LoadingSkeletons'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/data/products'
import { useProducts } from '@/hooks/useProducts'

export default function ShopPageContent() {
  const { products, loading, error } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo<Product[]>(() => {
    if (!searchTerm) return products
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b py-4">
          <div className="container-fluid">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <Link href="/" className="hover:text-blue-600">Home</Link> / Shop
              </p>
              {!loading && filteredProducts.length > 0 && (
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> products
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="container-fluid py-12">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by product name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-700"
            />
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading products: {error}</p>
              <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {searchTerm ? 'No products match your search' : 'No products found'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
