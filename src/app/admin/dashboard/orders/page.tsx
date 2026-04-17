'use client'

import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import { useOrders } from '@/context/OrderContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Trash2, CheckCircle, Clock, Truck, Package, Search, X } from 'lucide-react'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { isAdmin } = useAdmin()
  const { orders, deleteOrder, updateOrderStatus } = useOrders()
  const [mounted, setMounted] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const query_lower = query.toLowerCase()
    const matches = orders
      .filter((order) => {
        // Search by tracking code
        if (order.trackingCode.toLowerCase().includes(query_lower)) return true
        // Search by customer name
        if (order.customerName.toLowerCase().includes(query_lower)) return true
        // Search by phone
        if (order.customerPhone.includes(query)) return true
        // Search by order ID
        if (order.id.includes(query)) return true
        return false
      })
      .map((order) => order.id)
    
    setSearchResults(matches)
    setIsSearching(true)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearching(false)
  }

  const displayedOrders = isSearching ? orders.filter((o) => searchResults.includes(o.id)) : orders

  if (!mounted || !isAdmin) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={18} />
      case 'confirmed':
        return <CheckCircle className="text-burgundy-600" size={18} />
      case 'shipped':
        return <Truck className="text-purple-600" size={18} />
      case 'delivered':
        return <Package className="text-green-600" size={18} />
      default:
        return <Clock size={18} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-burgundy-100 text-burgundy-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const currentOrder = orders.find((o) => o.id === selectedOrder)

  return (
    <div className="min-h-screen bg-burgundy-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 text-white py-6 shadow-md">
        <div className="container-fluid">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="hover:bg-burgundy-700 p-2 rounded transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Customer Orders</h1>
              <p className="text-burgundy-100">Manage all buyer orders and payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <p className="text-gray-400">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders ({displayedOrders.length})</h2>
                    
                    {/* Search Bar */}
                    <div className="relative">
                      <div className="flex items-center">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search by tracking code, customer name, phone, or order ID..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border border-burgundy-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                        />
                        {searchQuery && (
                          <button
                            onClick={clearSearch}
                            className="absolute right-3 text-gray-400 hover:text-gray-600"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                      {isSearching && (
                        <p className="text-sm text-gray-500 mt-2">
                          Found {displayedOrders.length} result{displayedOrders.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order.id)}
                        className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedOrder === order.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{order.customerName}</p>
                            <p className="text-sm text-gray-600 font-mono font-bold">Order ID: {order.id}</p>
                            <p className="text-xs text-gray-400 mt-1">Keep this order id for future queries</p>
                            <p className="text-xs text-blue-600 font-mono font-bold mt-1">Track: {order.trackingCode}</p>
                            <p className="text-xs text-gray-400 mt-1">{order.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">৳{order.total.toLocaleString()}</p>
                            <div className="flex items-center space-x-1 mt-2 justify-end">
                              {getStatusIcon(order.status)}
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.customerCity}
                          </p>
                          <Eye size={16} className="text-gray-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">
                        {isSearching ? 'No orders found matching your search' : 'No orders yet'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              {currentOrder ? (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 font-semibold">Order ID</p>
                        <p className="font-mono font-bold text-gray-900 text-lg">{currentOrder.id}</p>
                        <p className="text-xs text-gray-500 mt-2">Keep this order id for future queries</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date & Time</p>
                        <p className="font-semibold text-gray-900">{currentOrder.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(currentOrder.status)}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(currentOrder.status)}`}>
                            {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Update Status:</p>
                      <div className="space-y-2">
                        {(['pending', 'confirmed', 'shipped', 'delivered'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(currentOrder.id, status)}
                            className={`w-full px-3 py-2 rounded text-sm font-semibold transition ${
                              currentOrder.status === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Info</h3>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{currentOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{currentOrder.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{currentOrder.customerEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">City</p>
                        <p className="font-semibold text-gray-900">{currentOrder.customerCity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Address</p>
                        <p className="font-semibold text-gray-900 break-words">{currentOrder.customerAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Items ({currentOrder.items.length})</h3>

                    <div className="space-y-3">
                      {currentOrder.items.map((item) => (
                        <div key={item.id} className="py-2 border-b last:border-b-0">
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>
                              {item.size} × {item.quantity}
                            </span>
                            <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>৳{currentOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Discount</span>
                        <span>-৳{currentOrder.discount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>৳{currentOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Code Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Tracking Code</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-mono font-bold text-blue-600">
                        {currentOrder.trackingCode}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentOrder.trackingCode)
                          alert('Tracking code copied to clipboard!')
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Customer can use this code at /track to view order status
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this order?')) {
                        deleteOrder(currentOrder.id)
                        setSelectedOrder(null)
                      }
                    }}
                    className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                  >
                    <Trash2 size={18} />
                    <span>Delete Order</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        {displayedOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">{isSearching ? 'Search Results' : 'Total Orders'}</p>
              <p className="text-3xl font-bold text-blue-600">{displayedOrders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {displayedOrders.filter((o) => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Shipped</p>
              <p className="text-3xl font-bold text-purple-600">
                {displayedOrders.filter((o) => o.status === 'shipped').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">{isSearching ? 'Results Revenue' : 'Total Revenue'}</p>
              <p className="text-3xl font-bold text-green-600">
                ৳{displayedOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
