// Utility to fetch perfume images from Fragrantica
const IMAGE_CACHE = new Map<string, string>()
const FAILED_CACHE = new Set<string>()

export async function fetchFragranticaImage(
  productName: string,
  brand: string,
  fallbackImage: string = '/placeholder.jpg'
): Promise<string> {
  try {
    // Check cache first
    const cacheKey = `${brand}-${productName}`
    
    // If already failed before, return fallback immediately
    if (FAILED_CACHE.has(cacheKey)) {
      return fallbackImage
    }
    
    if (IMAGE_CACHE.has(cacheKey)) {
      return IMAGE_CACHE.get(cacheKey) || fallbackImage
    }

    // Fetch from API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    const response = await fetch(
      `/api/fetch-fragrantica-image?name=${encodeURIComponent(productName)}&brand=${encodeURIComponent(brand)}`,
      { 
        method: 'GET',
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (data.success && data.imageUrl) {
        // Cache the result
        IMAGE_CACHE.set(cacheKey, data.imageUrl)
        return data.imageUrl
      }
    }

    // Mark as failed to avoid repeated attempts
    FAILED_CACHE.add(cacheKey)
    return fallbackImage
  } catch {
    const cacheKey = `${brand}-${productName}`
    FAILED_CACHE.add(cacheKey)
    console.warn(`Failed to fetch fragrantica image for ${brand} ${productName}`)
    return fallbackImage
  }
}

// Batch fetch multiple images
export async function fetchMultipleFragranticaImages(
  products: Array<{ name: string; brand: string; id: string }>
) {
  const results = await Promise.all(
    products.map(async (product) => ({
      id: product.id,
      imageUrl: await fetchFragranticaImage(product.name, product.brand),
    }))
  )
  return results
}
