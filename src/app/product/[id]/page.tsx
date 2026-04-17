'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { ImageCarousel } from '@/components/ImageCarousel'
import { StarRating } from '@/components/StarRating'
import { products } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useReview } from '@/context/ReviewContext'
import { useNotification } from '@/context/NotificationContext'
import { useAdmin } from '@/context/AdminContext'
import { useState, useMemo } from 'react'
import { Heart, Share2, Check, Zap } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { adminProducts } = useAdmin()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { getProductReviews, getAverageRating, addReview } = useReview()
  const { addNotification } = useNotification()

  // Find product from either default products or admin products
  const product = useMemo(() => {
    return products.find((p) => p.id === params.id) || adminProducts.find((p) => p.id === params.id)
  }, [params.id, adminProducts])

  // Get similar products for recommendations
  const similarProducts = useMemo(() => {
    if (!product) return []
    return [...products, ...adminProducts]
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
  }, [product, adminProducts])

  // State
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '', author: '' })

  const wishlisted = product ? isInWishlist(product.id) : false
  const reviews = product ? getProductReviews(product.id) : []
  const averageRating = product ? getAverageRating(product.id) : 0

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-4">Product not found</p>
            <Link href="/shop" className="btn-primary">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.inStock === false) {
      addNotification({ type: 'warning', message: 'This perfume is currently stock out' })
      return
    }

    if (!selectedSize) {
      addNotification({ type: 'warning', message: 'Please select a size first' })
      return
    }

    const variantPrice = product.variantPrices?.[selectedSize]
    const selectedPrice = typeof variantPrice === 'number' ? variantPrice : product.price.min

    addToCart({
      id: product.id,
      name: product.name,
      price: selectedPrice,
      size: selectedSize,
      quantity,
      image: product.image,
    })

    addNotification({ type: 'success', message: `${product.name} added to cart!` })
    setQuantity(1)
  }

  const handleToggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id)
      addNotification({ type: 'info', message: 'Removed from wishlist' })
    } else {
      addToWishlist(product)
      addNotification({ type: 'success', message: 'Added to wishlist!' })
    }
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewForm.author || !reviewForm.title || !reviewForm.comment) {
      addNotification({ type: 'warning', message: 'Please fill in all fields' })
      return
    }

    addReview({
      productId: product.id,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
      author: reviewForm.author,
      verified: true,
    })

    setReviewForm({ rating: 5, title: '', comment: '', author: '' })
    setShowReviewForm(false)
    addNotification({ type: 'success', message: 'Thank you for your review!' })
  }

  const savingsAmount = product.price.max - product.price.min
  const savingsPercent = Math.round((savingsAmount / product.price.max) * 100)

  const selectedVariantPrice = product.variantPrices?.[selectedSize]
  const selectedPrice = typeof selectedVariantPrice === 'number' ? selectedVariantPrice : product.price.min

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b py-3">
          <div className="container-fluid">
            <p className="text-gray-600 text-sm">
              <Link href="/" className="hover:text-blue-600">Home</Link> / 
              <Link href="/shop" className="hover:text-blue-600"> Shop</Link> / {product.name}
            </p>
          </div>
        </div>

        <div className="container-fluid py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Product Image with Carousel */}
            <div>
              {product.isHot && (
                <div className="mb-4 inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  🔥 HOT DEAL - Save ৳{savingsAmount.toLocaleString()}!
                </div>
              )}
              <ImageCarousel images={[product.image]} alt={product.name} />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-widest font-semibold mb-2">
                  {product.brand}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-4">
                  <StarRating rating={averageRating} count={reviews.length} />
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-4xl font-bold text-blue-600">
                    ৳{selectedPrice.toLocaleString()}
                  </span>
                  {product.price.max > product.price.min && (
                    <span className="text-lg text-gray-500 line-through">
                      ৳{product.price.max.toLocaleString()}
                    </span>
                  )}
                </div>
                {savingsAmount > 0 && (
                  <p className="text-green-600 font-semibold text-sm">
                    💚 Save ৳{savingsAmount.toLocaleString()} ({savingsPercent}%)
                  </p>
                )}
                {product.inStock === false && (
                  <p className="text-red-600 font-semibold text-sm mt-2">Stock Out</p>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Fragrance Notes */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Fragrance Notes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <span
                      key={note}
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <Zap size={20} />
                  <span>{product.inStock === false ? 'Stock Out' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`px-6 py-3 rounded-lg font-bold transition ${
                    wishlisted
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition"
                  title="Share this product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews ({reviews.length})</h2>

            {/* Review Form */}
            {showReviewForm && (
              <div className="card p-6 mb-8 animate-scale-in">
                <h3 className="font-bold text-lg mb-4">Leave a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Name</label>
                    <input
                      type="text"
                      value={reviewForm.author}
                      onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      interactive
                      onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Review title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Share your thoughts about this product"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary mb-8"
              >
                Write a Review
              </button>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="card p-6 animate-fade-in">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{review.title}</p>
                        <p className="text-sm text-gray-600">By {review.author}</p>
                      </div>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Check size={14} /> Verified
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-gray-700 mt-3">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Recommended Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
