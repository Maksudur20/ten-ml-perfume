'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Upload } from 'lucide-react'

interface Banner {
  _id: string
  title: string
  image: string
  link: string
  position: number
  isActive: boolean
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    position: 0,
    isActive: true,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/banners', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await response.json()
      if (data.banners) {
        // Sort by position
        setBanners(data.banners.sort((a: Banner, b: Banner) => a.position - b.position))
      }
    } catch (err) {
      setError('Failed to fetch banners')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      formDataObj.append('folder', 'banners')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      })

      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }))
        setSuccess('Image uploaded successfully')
      }
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0])
      handleImageUpload(e.target.files[0])
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.image || !formData.link) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('You must be logged in as admin')
        return
      }

      const url = editingId ? `/api/banners/${editingId}` : '/api/banners'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to save banner')
        return
      }

      setSuccess(
        editingId ? 'Banner updated successfully' : 'Banner created successfully'
      )
      setFormData({ title: '', image: '', link: '', position: 0, isActive: true })
      setEditingId(null)
      setShowForm(false)
      fetchBanners()
    } catch (err) {
      setError('Failed to save banner')
      console.error(err)
    }
  }

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link,
      position: banner.position,
      isActive: banner.isActive,
    })
    setEditingId(banner._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!response.ok) {
        setError('Failed to delete banner')
        return
      }

      setSuccess('Banner deleted successfully')
      fetchBanners()
    } catch (err) {
      setError('Failed to delete banner')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', image: '', link: '', position: 0, isActive: true })
    setEditingId(null)
    setShowForm(false)
    setImageFile(null)
  }

  if (loading) {
    return <div className="text-center py-10">Loading banners...</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-burgundy-900">Banner Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Add Banner
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Collection"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link *
              </label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="e.g., /shop/summer or /product/xyz"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position (Order)
              </label>
              <input
                type="number"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="text-burgundy-600" size={32} />
                <span className="text-sm font-medium text-gray-700">
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                </span>
              </label>

              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex items-center gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white px-6 py-2 rounded-lg transition"
            >
              <Save size={20} />
              {editingId ? 'Update' : 'Create'} Banner
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No banners created yet. Create your first banner!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{banner.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{banner.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate">
                      {banner.link}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          banner.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
