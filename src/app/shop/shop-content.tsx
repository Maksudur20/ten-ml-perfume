'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/LoadingSkeletons'
import { useMemo } from 'react'
import Link from 'next/link'
import { Product } from '@/data/products'
import { useAdmin } from '@/context/AdminContext'
import { products as staticProducts } from '@/data/products'

export default function ShopPageContent() {
  const { adminProducts } = useAdmin()

  const products = useMemo<Product[]>(() => {
    return [...staticProducts, ...adminProducts]
  }, [adminProducts])

  const isLoading = false

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
              {products.length > 0 && (
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{products.length}</span> products
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="container-fluid py-12">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No products found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
