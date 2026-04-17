/**
 * Image Handler Utility
 * Automatically detects image type, validates format, and optimizes display
 */

export interface DetectedImageInfo {
  type: string
  mimeType: string
  width: number
  height: number
  size: number
  isValid: boolean
  error?: string
  aspectRatio: number
}

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/avif', 'image/webp', 'image/svg+xml']

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Detect image type and validate
 * @param file - File object from input
 * @returns DetectedImageInfo with image metadata
 */
export async function detectImageType(file: File): Promise<DetectedImageInfo> {
  return new Promise((resolve) => {
    const fileSize = file.size

    // Check file size
    if (fileSize > MAX_IMAGE_SIZE) {
      resolve({
        type: 'unknown',
        mimeType: file.type,
        width: 0,
        height: 0,
        size: fileSize,
        isValid: false,
        error: `File size exceeds 5MB limit (${(fileSize / 1024 / 1024).toFixed(2)}MB)`,
        aspectRatio: 0,
      })
      return
    }

    // Check MIME type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      resolve({
        type: 'unknown',
        mimeType: file.type,
        width: 0,
        height: 0,
        size: fileSize,
        isValid: false,
        error: `Unsupported format: ${file.type || 'unknown'}. Supported: JPEG, PNG, AVIF, WebP`,
        aspectRatio: 0,
      })
      return
    }

    // Create image to get dimensions
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const imageType = getImageTypeLabel(file.type)
        resolve({
          type: imageType,
          mimeType: file.type,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: fileSize,
          isValid: true,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        })
      }
      img.onerror = () => {
        resolve({
          type: 'unknown',
          mimeType: file.type,
          width: 0,
          height: 0,
          size: fileSize,
          isValid: false,
          error: 'Invalid image file or corrupted data',
          aspectRatio: 0,
        })
      }
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result
      }
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Get human-readable image type label
 */
function getImageTypeLabel(mimeType: string): string {
  const labels: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/avif': 'AVIF',
    'image/webp': 'WebP',
    'image/svg+xml': 'SVG',
  }
  return labels[mimeType] || 'Image'
}

/**
 * Get optimal display dimensions maintaining aspect ratio
 */
export function getOptimalDisplayDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number = 500,
  maxHeight: number = 600
): { width: number; height: number } {
  const aspectRatio = naturalWidth / naturalHeight

  let displayWidth = naturalWidth
  let displayHeight = naturalHeight

  // Scale down if too large
  if (displayWidth > maxWidth) {
    displayWidth = maxWidth
    displayHeight = displayWidth / aspectRatio
  }

  if (displayHeight > maxHeight) {
    displayHeight = maxHeight
    displayWidth = displayHeight * aspectRatio
  }

  return {
    width: Math.round(displayWidth),
    height: Math.round(displayHeight),
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate image before upload
 */
export function validateImage(imageInfo: DetectedImageInfo): {
  isValid: boolean
  messages: string[]
} {
  const messages: string[] = []

  if (!imageInfo.isValid) {
    messages.push(imageInfo.error || 'Image validation failed')
    return { isValid: false, messages }
  }

  if (imageInfo.width < 100 || imageInfo.height < 100) {
    messages.push(`Image too small (${imageInfo.width}x${imageInfo.height}). Minimum: 100x100px`)
  }

  if (imageInfo.width > 10000 || imageInfo.height > 10000) {
    messages.push(`Image too large (${imageInfo.width}x${imageInfo.height}). Maximum: 10000x10000px`)
  }

  return {
    isValid: messages.length === 0,
    messages,
  }
}

/**
 * Get image quality recommendations
 */
export function getImageQualityInfo(imageInfo: DetectedImageInfo): {
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  recommendations: string[]
  score: number
} {
  const recommendations: string[] = []
  let score = 100

  // Check dimensions
  if (imageInfo.width < 300 || imageInfo.height < 300) {
    recommendations.push('Consider using higher resolution image (300x300px minimum)')
    score -= 20
  }
  if (imageInfo.width < 500 || imageInfo.height < 500) {
    recommendations.push('Good resolution, but 500x500px+ recommended for better quality')
    score -= 10
  }

  // Check file size
  const fileSizeInMB = imageInfo.size / (1024 * 1024)
  if (fileSizeInMB > 2) {
    recommendations.push(`File size is ${fileSizeInMB.toFixed(2)}MB. Consider compressing to reduce load time`)
    score -= 15
  }
  if (fileSizeInMB > 1) {
    recommendations.push('Consider optimizing image size for faster loading')
    score -= 5
  }

  // Aspect ratio check
  if (imageInfo.aspectRatio < 0.7 || imageInfo.aspectRatio > 1.4) {
    recommendations.push('Unusual aspect ratio detected. Square or near-square images work best for product displays')
    score -= 10
  }

  // Format recommendations
  if (imageInfo.mimeType === 'image/jpeg') {
    recommendations.push('JPEG format detected. Consider AVIF for better compression without quality loss')
    score -= 5
  }

  let quality: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 85) quality = 'excellent'
  else if (score >= 70) quality = 'good'
  else if (score >= 50) quality = 'fair'
  else quality = 'poor'

  return { quality, recommendations, score }
}
