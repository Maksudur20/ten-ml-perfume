'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Product } from '@/data/products'

export default function DeleteProductPage() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin, adminProducts, deleteProduct } = useAdmin()
  const [product, setProduct] = useState<(Product & { sizes?: string[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login')
      return
    }

    const loadProduct = async () => {
      if (!params || typeof params.id !== 'string') {
        setLoading(false)
        return
      }

      // First try to find in adminProducts
      const foundInLocal = adminProducts.find((p) => p.id === params.id)
      if (foundInLocal) {
        setProduct(foundInLocal)
        setLoading(false)
        return
      }

      // If not found locally, fetch from database
      try {
        const response = await fetch(`/api/db/products?productId=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.products && data.products.length > 0) {
            setProduct(data.products[0])
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [isAdmin, adminProducts, params, router])

  const handleDelete = async () => {
    if (params && typeof params.id === 'string') {
      try {
        setIsDeleting(true)
        await deleteProduct(params.id)
        alert('Product deleted successfully and removed from database!')
        router.push('/admin/dashboard')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
        setIsDeleting(false)
      }
    }
  }

  if (!isAdmin || loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500" size={48} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Product?</h1>
        <p className="text-gray-600 text-center mb-6">This action cannot be undone.</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>{product.brand} - {product.name}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">Price: ৳{product.price.min} - ৳{product.price.max}</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 btn-glass-dark font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
          <Link
            href="/admin/dashboard"
            className="flex-1 btn-glass-light font-semibold py-3 text-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}
