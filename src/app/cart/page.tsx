'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const handleApplyPromo = () => {
    if (promoCode === 'SAVE10') {
      setDiscount(cartTotal * 0.1)
    } else if (promoCode === 'SAVE20') {
      setDiscount(cartTotal * 0.2)
    } else {
      setDiscount(0)
      alert('Invalid promo code')
    }
  }

  const finalTotal = cartTotal - discount

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gray-50 border-b py-4">
          <div className="container-fluid">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>

        <div className="container-fluid py-12">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
              <Link href="/shop" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="card">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Size: {item.size}</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer pointer-events-auto"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer pointer-events-auto"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-24">
                          <p className="font-bold text-gray-900">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ৳{item.price.toLocaleString()} each
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition cursor-pointer pointer-events-auto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="card p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>৳{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>৳0</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-৳{discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-2xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>৳{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="btn-secondary px-4 py-2"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Try: SAVE10 or SAVE20</p>
                  </div>

                  <Link 
                    href="/checkout"
                    className="w-full btn-primary py-3 mb-3 block text-center"
                  >
                    Proceed to Checkout
                  </Link>

                  <button
                    onClick={() => clearCart()}
                    className="w-full btn-secondary py-2"
                  >
                    Clear Cart
                  </button>

                  <Link href="/shop" className="block text-center text-blue-600 hover:text-blue-700 mt-4">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
