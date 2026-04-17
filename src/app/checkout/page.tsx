'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { useOrders, Order } from '@/context/OrderContext'
import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle, Copy, ArrowRight } from 'lucide-react'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { addOrder } = useOrders()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    try {
      // Calculate delivery charge
      const deliveryCharge = getDeliveryCharge(formData.city)
      const orderTotal = cartTotal + deliveryCharge

      // Create order with tracking code
      const newOrder = addOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        })),
        subtotal: cartTotal,
        discount: 0,
        total: orderTotal,
        status: 'pending',
      })

      // Order placement successful
      setCreatedOrder(newOrder)
      setOrderPlaced(true)
      clearCart()
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Error processing your order. Please try again.')
      setIsProcessing(false)
    }
  }

  const copyTrackingCode = () => {
    if (createdOrder?.trackingCode) {
      navigator.clipboard.writeText(createdOrder.trackingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Calculate delivery charge based on city
  const getDeliveryCharge = (city: string): number => {
    if (city.toLowerCase() === 'dhaka') {
      return 70
    } else {
      return 120
    }
  }

  const deliveryCharge = formData.city ? getDeliveryCharge(formData.city) : 0
  const finalTotal = cartTotal + deliveryCharge

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (orderPlaced && createdOrder) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="max-w-2xl w-full mx-auto px-4">
            <div className="card p-8 md:p-12">
              <div className="text-center mb-8">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 text-lg">Thank you for your purchase.</p>
              </div>

              {/* Tracking Code Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-8 border-2 border-blue-200">
                <p className="text-gray-700 font-semibold mb-4 text-center">Your Order Tracking Code:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl font-bold text-blue-600 tracking-widest font-mono">
                    {createdOrder.trackingCode}
                  </div>
                  <button
                    onClick={copyTrackingCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    title="Copy tracking code"
                  >
                    <Copy size={18} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-center mt-4">
                  Use this code to track your order status anytime
                </p>
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-700 font-semibold">Name:</span>
                  <span className="text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-700 font-semibold">Phone:</span>
                  <span className="text-gray-900">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-700 font-semibold">Location:</span>
                  <span className="text-gray-900">{formData.city}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-700 font-semibold">Order Date:</span>
                  <span className="text-gray-900">{createdOrder.timestamp}</span>
                </div>
                <div className="flex justify-between py-3 border-b bg-green-50 px-3 rounded">
                  <span className="text-gray-700 font-semibold">Status:</span>
                  <span className="text-green-600 font-bold uppercase text-sm">
                    {createdOrder.status}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>৳{createdOrder.subtotal.toLocaleString('en-BD')}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>
                        Delivery Charge ({formData.city.toLowerCase() === 'dhaka' ? 'Dhaka' : 'Other'}):
                      </span>
                      <span className="font-semibold">
                        ৳{(createdOrder.total - createdOrder.subtotal).toLocaleString('en-BD')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-700 font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ৳{createdOrder.total.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/track"
                  className="w-full btn-primary justify-center flex items-center gap-2"
                >
                  <span>Track Order</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/" className="w-full btn-secondary text-center">
                  Return to Home
                </Link>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> Save your tracking code <strong>{createdOrder.trackingCode}</strong> to track your order
                  status. We&apos;ll also contact you at <strong>{formData.phone}</strong> for updates.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container-fluid py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Order Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Form */}
          <div>
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dhaka, Chattogram, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 btn-primary disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between py-3 border-b">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">x{item.quantity}</p>
                      <p className="text-blue-600">৳{(item.price * item.quantity).toLocaleString('en-BD')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>৳{cartTotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.city ? `৳${deliveryCharge.toLocaleString('en-BD')}` : 'Enter city'}
                  </span>
                </div>
                {formData.city && (
                  <p className="text-xs text-gray-500">
                    {formData.city.toLowerCase() === 'dhaka'
                      ? '📍 Dhaka delivery charge: 70 taka'
                      : '📍 Outside Dhaka delivery charge: 120 taka'}
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Total:</span>
                  <span className="text-blue-600">৳{finalTotal.toLocaleString('en-BD')}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">✓</span> Your order will be confirmed instantly
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">✓</span> You&apos;ll receive a unique tracking code
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">🚚</span> Delivery: Dhaka (70৳) | Other areas (120৳)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
