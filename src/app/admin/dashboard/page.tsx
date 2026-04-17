'use client'

import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import { useOrders } from '@/context/OrderContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, LogOut, ShoppingBag } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, setIsAdmin, adminProducts, loadProductsFromDatabase } = useAdmin()
  const { orders } = useOrders()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAdmin) {
      router.push('/admin/login')
    } else {
      // Load products from database when admin dashboard loads
      loadProductsFromDatabase()
    }
  }, [isAdmin, router, loadProductsFromDatabase])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
    router.push('/')
  }

  if (!mounted || !isAdmin) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-burgundy-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 text-white py-6 shadow-md">
        <div className="container-fluid flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-burgundy-100">Manage 10ML Perfume Products & Orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/dashboard/orders"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition font-semibold"
            >
              <ShoppingBag size={18} />
              <span>Orders ({orders.length})</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-8">
        {/* Add New Product Button */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard/add-product"
            className="inline-flex items-center space-x-2 btn-glass-dark font-semibold px-6 py-3"
          >
            <Plus size={20} />
            <span>Add New Perfume</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit / Stock Out Perfumes ({adminProducts.length})
            </h2>
          </div>

          {adminProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No products added yet</p>
              <Link
                href="/admin/dashboard/add-product"
                className="text-burgundy-600 hover:text-burgundy-700 font-semibold"
              >
                Add your first perfume →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Brand</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price Range</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sizes</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{product.brand}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-burgundy-100 text-burgundy-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {product.inStock === false ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Stock Out
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ৳{product.price.min} - ৳{product.price.max}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sizes.join(', ')}</td>
                      <td className="px-6 py-4 text-sm flex space-x-2">
                        <Link
                          href={`/admin/dashboard/edit-product/${product.id}`}
                          className="flex items-center space-x-1 text-burgundy-600 hover:text-burgundy-700 font-semibold"
                        >
                          <Edit2 size={16} />
                          <span>Edit / Stock Out</span>
                        </Link>
                        <Link
                          href={`/admin/dashboard/delete-product/${product.id}`}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-semibold"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold text-burgundy-600">{adminProducts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-green-600">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Revenue</p>
            <p className="text-3xl font-bold text-purple-600">
              ৳{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Featured Products</p>
            <p className="text-3xl font-bold text-orange-600">{adminProducts.filter((p) => p.isHot).length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
