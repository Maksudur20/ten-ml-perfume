'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useOrders } from '@/context/OrderContext'
import type { Order, OrderItem } from '@/context/OrderContext'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Package, MapPin, Phone, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TrackOrderPage() {
  const { getOrderByTrackingCode } = useOrders()
  const [trackingCode, setTrackingCode] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingCode.trim()) {
      alert('Please enter a tracking code')
      return
    }

    const order = getOrderByTrackingCode(trackingCode.toUpperCase())
    setSearchedOrder(order ?? null)
    setSearched(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'confirmed':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'shipped':
        return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container-fluid py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-lg text-gray-600">
              Enter your 6-character tracking code to check your order status
            </p>
          </div>

          {/* Search Form */}
          <div className="card p-8 mb-12">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono font-bold tracking-widest"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && (
            <>
              {searchedOrder ? (
                <div className="space-y-6">
                  {/* Order Status Card */}
                  <div className={`card p-8 border-2 ${getStatusColor(searchedOrder.status)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(searchedOrder.status)}
                        <div>
                          <p className="text-sm font-semibold uppercase">Order Status</p>
                          <p className="text-2xl font-bold capitalize">{searchedOrder.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tracking Code</p>
                        <p className="text-2xl font-mono font-bold text-blue-600">
                          {searchedOrder.trackingCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Customer Info */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">Customer Information</h3>
                        <div className="space-y-2 text-gray-700">
                          <p>
                            <span className="font-semibold">Name:</span> {searchedOrder.customerName}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone size={16} className="text-blue-600" />
                            <span>
                              <span className="font-semibold">Phone:</span> {searchedOrder.customerPhone}
                            </span>
                          </p>
                          {searchedOrder.customerEmail && (
                            <p>
                              <span className="font-semibold">Email:</span> {searchedOrder.customerEmail}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
                        <div className="space-y-2 text-gray-700 flex items-start gap-2">
                          <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <p>{searchedOrder.customerAddress}</p>
                            <p className="font-semibold">{searchedOrder.customerCity}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Date */}
                    <div className="py-4 border-t border-b mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-blue-600" />
                        <span>
                          <span className="font-semibold">Order Date:</span> {searchedOrder.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Items</h3>
                      <div className="space-y-3">
                        {searchedOrder.items.map(
                          (item: OrderItem, idx: number) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b">
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-bold text-gray-900">
                                ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-6 border-t-2 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                      <span className="text-3xl font-bold text-blue-600">
                        ৳{searchedOrder.total.toLocaleString('en-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="card p-6 bg-blue-50 border border-blue-200">
                    <p className="text-gray-700">
                      <span className="font-semibold">📞 Need Help?</span> Contact us at +880 1580-310965 or
                      email info@10mlperfume.com
                    </p>
                  </div>

                  {/* Back to Shop */}
                  <div className="flex gap-4">
                    <Link href="/shop" className="flex-1 btn-secondary text-center">
                      Continue Shopping
                    </Link>
                    <button
                      onClick={() => {
                        setTrackingCode('')
                        setSearchedOrder(null)
                        setSearched(false)
                      }}
                      className="flex-1 btn-primary"
                    >
                      Search Another Order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="mb-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">
                      We couldn&apos;t find an order with tracking code{' '}
                      <span className="font-mono font-bold text-gray-900">{trackingCode}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-600">Please check the following:</p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-600">•</span>
                        <span>The tracking code is exactly 6 characters</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-600">•</span>
                        <span>There are no spaces or special characters</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-600">•</span>
                        <span>You entered the correct tracking code from your order confirmation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => {
                        setTrackingCode('')
                        setSearchedOrder(null)
                        setSearched(false)
                      }}
                      className="w-full btn-primary"
                    >
                      Try Again
                    </button>
                    <Link href="/" className="w-full btn-secondary text-center block">
                      Return to Home
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Initial State - Tips */}
          {!searched && (
            <div className="card p-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How to Track Your Order</h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex gap-2">
                  <span className="font-bold text-blue-600 text-lg">1.</span>
                  <span>Find your 6-character tracking code from your order confirmation email or SMS</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-blue-600 text-lg">2.</span>
                  <span>Enter the code in the search box above (e.g., ABC123)</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-blue-600 text-lg">3.</span>
                  <span>Click &quot;Search&quot; to view your order status and delivery details</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
