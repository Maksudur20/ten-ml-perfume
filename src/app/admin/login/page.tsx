'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { setIsAdmin } = useAdmin()

  // Default admin password (should be changed in production)
  const ADMIN_PASSWORD = 'admin123'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminToken', 'authenticated')
      setIsAdmin(true)
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-burgundy-900 mb-2 text-center">Admin Login</h1>
        <p className="text-burgundy-700 text-center mb-6">Enter your password to access the admin dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-burgundy-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border border-burgundy-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              required
            />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-burgundy-600 text-white font-semibold py-2 rounded-lg hover:bg-burgundy-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-burgundy-600 hover:text-burgundy-700 font-semibold">
            ← Back to Home
          </Link>
        </div>

        <div className="mt-6 p-3 bg-burgundy-50 border border-burgundy-200 rounded-lg">
          <p className="text-xs text-burgundy-700">
            <strong>Demo Password:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  )
}
