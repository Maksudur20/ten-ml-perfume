'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useWishlist } from '@/context/WishlistContext'
import Link from 'next/link'
import Image from 'next/image'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gray-50 border-b py-4">
          <div className="container-fluid">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
        </div>

        <div className="container-fluid py-12">
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
              <Link href="/shop" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product.id} className="card overflow-hidden group">
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-blue-600">
                        ৳{product.price.min}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="flex-1 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="flex-1 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
