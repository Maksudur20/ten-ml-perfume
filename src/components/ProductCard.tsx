'use client'

import Link from 'next/link'
import { Product } from '@/data/products'
import { Heart, Eye, ShoppingCart, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { fetchFragranticaImage } from '@/utils/fragranticaHelper'

interface ProductCardProps {
  product: Product & { sizes?: string[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [showSizeMessage, setShowSizeMessage] = useState(false)
  const [productImage, setProductImage] = useState(product.image)

  const wishlisted = isInWishlist(product.id)

  // Fetch Fragrantica image on component mount
  useEffect(() => {
    const loadFragranticaImage = async () => {
      const imageUrl = await fetchFragranticaImage(product.name, product.brand, product.image)
      setProductImage(imageUrl)
    }

    loadFragranticaImage()
  }, [product.id, product.name, product.brand, product.image])

  const handleImageError = () => {
    setProductImage(product.image)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (wishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleQuickAdd = () => {
    if (product.inStock === false) {
      return
    }

    if (!selectedSize) {
      setShowSizeMessage(true)
      setTimeout(() => setShowSizeMessage(false), 2000)
      return
    }

    setIsAdding(true)

    const variantPrice = product.variantPrices?.[selectedSize]
    const selectedPrice = typeof variantPrice === 'number' ? variantPrice : product.price.min

    addToCart({
      id: product.id,
      name: product.name,
      price: selectedPrice,
      size: selectedSize,
      quantity,
      image: productImage,
    })

    setAddedSuccess(true)
    setQuantity(1)
    setTimeout(() => {
      setAddedSuccess(false)
      setIsAdding(false)
    }, 1500)
  }

  return (
    <div
      className="card overflow-hidden cursor-pointer group transition-all hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative bg-gray-100 h-64 overflow-hidden">
        {product.inStock === false && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
            STOCK OUT
          </div>
        )}
        {product.isHot && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
            🔥 HOT
          </div>
        )}

        <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
          />
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-4 transition-all duration-300 z-10">
            <Link
              href={`/product/${product.id}`}
              className="bg-white text-burgundy-700 rounded-full p-3 hover:bg-burgundy-700 hover:text-white transition-all transform hover:scale-110"
              title="View details"
            >
              <Eye size={20} />
            </Link>
            <button
              type="button"
              onClick={handleWishlist}
              className="bg-white text-gray-600 rounded-full p-3 hover:bg-accent hover:text-burgundy-900 transition-all transform hover:scale-110 cursor-pointer pointer-events-auto"
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold cursor-pointer hover:text-burgundy-700 transition">
            {product.brand}
          </p>
          <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2 h-9 cursor-pointer hover:text-burgundy-700 transition">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-lg font-bold text-burgundy-700">
            ৳{
              (typeof product.variantPrices?.[selectedSize] === 'number'
                ? product.variantPrices?.[selectedSize]
                : product.price.min
              )?.toLocaleString()
            }
          </span>
          {product.price.max > product.price.min && (
            <span className="text-gray-500 line-through text-xs">
              ৳{product.price.max.toLocaleString()}
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.sizes.map((size: string) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-1 text-xs border rounded transition-all cursor-pointer pointer-events-auto font-medium ${
                selectedSize === size
                  ? 'btn-glass-light'
                  : 'btn-glass'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Quantity Control */}
        <div className="mt-3 flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 transition cursor-pointer pointer-events-auto"
            title="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm flex-1 text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 transition cursor-pointer pointer-events-auto"
            title="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Messages */}
        {showSizeMessage && (
          <div className="mt-2 text-xs text-red-500 text-center font-medium animate-pulse">
            Please select a size
          </div>
        )}

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAdding || product.inStock === false}
          className={`w-full mt-3 text-sm py-2 font-semibold flex items-center justify-center space-x-2 cursor-pointer pointer-events-auto transition-all ${
            addedSuccess
              ? 'bg-green-600 text-white rounded-lg'
              : 'btn-glass-light'
          } disabled:opacity-50`}
        >
          {addedSuccess ? (
            <>
              <Check size={16} />
              <span>Added to cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>{product.inStock === false ? 'Stock Out' : 'Add to Cart'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
