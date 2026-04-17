'use client'

import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { PERFUME_SIZE_OPTIONS } from '@/utils/perfumeSizes'
import {
  detectImageType,
  DetectedImageInfo,
  formatFileSize,
  validateImage,
  getImageQualityInfo,
} from '@/utils/imageHandler'

export default function AddProductPage() {
  const router = useRouter()
  const { isAdmin, addProduct } = useAdmin()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'unisex' as 'men' | 'women' | 'unisex',
    description: '',
    notes: '',
    isHot: false,
  })
  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [imageInfo, setImageInfo] = useState<DetectedImageInfo | null>(null)
  const [imageValidation, setImageValidation] = useState<{ isValid: boolean; messages: string[] } | null>(null)
  const [imageQuality, setImageQuality] = useState<{
    quality: 'excellent' | 'good' | 'fair' | 'poor'
    recommendations: string[]
    score: number
  } | null>(null)
  const [stockOut, setStockOut] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PERFUME_SIZE_OPTIONS.map((s) => [s, false]))
  )
  const [pricesBySize, setPricesBySize] = useState<Record<string, string>>(() =>
    Object.fromEntries(PERFUME_SIZE_OPTIONS.map((s) => [s, '']))
  )

  if (!isAdmin) {
    return <div>Redirecting...</div>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    // Detect image type and get metadata
    const detectedInfo = await detectImageType(file)
    setImageInfo(detectedInfo)

    if (detectedInfo.isValid) {
      // Validate image based on detected info
      const validation = validateImage(detectedInfo)
      setImageValidation(validation)

      // Get quality info
      const quality = getImageQualityInfo(detectedInfo)
      setImageQuality(quality)

      // Read as data URL for preview
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : ''
        if (result) setImageDataUrl(result)
      }
      reader.readAsDataURL(file)
    } else {
      setImageValidation(null)
      setImageQuality(null)
    }
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [size]: !prev[size] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.brand) {
      alert('Please fill in all required fields')
      return
    }

    if (!imageDataUrl) {
      alert('Please select a perfume image')
      return
    }

    const enabledSizes = PERFUME_SIZE_OPTIONS.filter((s) => selectedSizes[s])
    if (enabledSizes.length === 0) {
      alert('Please select at least one ml option')
      return
    }

    const variantPricesEntries: Array<[string, number]> = []
    for (const size of enabledSizes) {
      const rawPrice = pricesBySize[size]
      const price = Number(rawPrice)
      if (!rawPrice || !Number.isFinite(price) || price <= 0) {
        alert(`Please enter a valid price for ${size}`)
        return
      }
      variantPricesEntries.push([size, price])
    }

    const variantPrices = Object.fromEntries(variantPricesEntries)
    const prices = Object.values(variantPrices)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: {
        min: minPrice,
        max: maxPrice,
      },
      image: imageDataUrl,
      description: formData.description,
      notes: formData.notes
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n),
      isHot: formData.isHot,
      sizes: enabledSizes,
      variantPrices,
      inStock: !stockOut,
    }

    try {
      setIsSubmitting(true)
      addProduct(newProduct)
      alert('Product added successfully and synced to database!')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 text-white py-6 shadow-md">
        <div className="container-fluid">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="hover:bg-burgundy-700 p-2 rounded transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Add New Perfume</h1>
              <p className="text-burgundy-100">Add a new product to the catalog</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container-fluid py-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stock Out */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={stockOut}
                onChange={(e) => setStockOut(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-burgundy-500"
              />
              <label className="text-sm font-semibold text-gray-900">Stock Out</label>
            </div>

            {/* Perfume Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Perfume Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                placeholder="Choose image"
                title="Select perfume image"
                aria-label="Perfume image file"
              />

              {/* Image Detection Error */}
              {imageInfo && !imageInfo.isValid && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Image Upload Error</p>
                    <p className="text-sm text-red-700">{imageInfo.error}</p>
                  </div>
                </div>
              )}

              {/* Image Info & Validation */}
              {imageInfo && imageInfo.isValid && (
                <div className="mt-4 space-y-3">
                  {/* Image Metadata */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Image Detected: {imageInfo.type}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 mt-2">
                          <div>
                            <span className="font-semibold">Dimensions:</span> {imageInfo.width}×{imageInfo.height}px
                          </div>
                          <div>
                            <span className="font-semibold">File Size:</span> {formatFileSize(imageInfo.size)}
                          </div>
                          <div>
                            <span className="font-semibold">Format:</span> {imageInfo.mimeType.replace('image/', '').toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold">Aspect Ratio:</span> {imageInfo.aspectRatio.toFixed(2)}:1
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Assessment */}
                  {imageQuality && (
                    <div
                      className={`border rounded-lg p-4 ${
                        imageQuality.quality === 'excellent'
                          ? 'bg-green-50 border-green-200'
                          : imageQuality.quality === 'good'
                            ? 'bg-blue-50 border-blue-200'
                            : imageQuality.quality === 'fair'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle
                          size={18}
                          className={
                            imageQuality.quality === 'excellent'
                              ? 'text-green-600'
                              : imageQuality.quality === 'good'
                                ? 'text-blue-600'
                                : 'text-yellow-600'
                          }
                        />
                        <span
                          className={`text-sm font-semibold ${
                            imageQuality.quality === 'excellent'
                              ? 'text-green-900'
                              : imageQuality.quality === 'good'
                                ? 'text-blue-900'
                                : 'text-yellow-900'
                          }`}
                        >
                          Quality: {imageQuality.quality.charAt(0).toUpperCase() + imageQuality.quality.slice(1)} ({imageQuality.score}/100)
                        </span>
                      </div>
                      {imageQuality.recommendations.length > 0 && (
                        <ul className="text-xs space-y-1">
                          {imageQuality.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0"></span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Validation Messages */}
                  {imageValidation && !imageValidation.isValid && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-900 mb-1">Validation Notice</p>
                        <ul className="text-xs text-yellow-700 space-y-1">
                          {imageValidation.messages.map((msg, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{msg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Full Size Preview */}
              {imageDataUrl && imageInfo && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Preview</p>
                  <div className="bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center p-4 min-h-96">
                    <picture>
                      <img
                        src={imageDataUrl}
                        alt="Selected perfume product preview"
                        className="max-w-full max-h-96 object-contain rounded"
                        title="Selected perfume image"
                      />
                    </picture>
                  </div>
                </div>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
                title="Brand name"
                aria-label="Brand name"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
                title="Product name"
                aria-label="Product name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                title="Product category"
                aria-label="Product category"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            {/* ML Selection + Pricing */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select ML & Set Price <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {PERFUME_SIZE_OPTIONS.map((size) => {
                  const enabled = selectedSizes[size]
                  return (
                    <div key={size} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleSize(size)}
                        className="w-4 h-4 rounded border-gray-300 focus:ring-burgundy-500"
                      />
                      <span className="w-40 text-sm font-semibold text-gray-900 capitalize">{size}</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder={enabled ? `Price for ${size} (৳)` : 'Select size to set price'}
                          value={pricesBySize[size]}
                          onChange={(e) =>
                            setPricesBySize((prev) => ({ ...prev, [size]: e.target.value }))
                          }
                          disabled={!enabled}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 disabled:bg-gray-100"
                          title={`Price for ${size} ML`}
                          aria-label={`Price for ${size} ML`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                title="Product description"
                aria-label="Product description"
              />
            </div>

            {/* Fragrance Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Fragrance Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g., Ambroxan, Citrus, Vanilla (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                title="Fragrance notes"
                aria-label="Fragrance notes"
              />
            </div>

            {/* Featured Product */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isHot"
                checked={formData.isHot}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 focus:ring-burgundy-500"
                title="Mark as featured product"
                aria-label="Mark as featured product"
              />
              <label className="text-sm font-semibold text-gray-900">Mark as Featured Product</label>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-glass-dark font-semibold py-3 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Perfume'}
              </button>
              <Link
                href="/admin/dashboard"
                className="flex-1 btn-glass-light font-semibold py-3 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
