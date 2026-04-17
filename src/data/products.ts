export interface Product {
  id: string
  name: string
  brand: string
  category: 'men' | 'women' | 'unisex'
  price: {
    min: number
    max: number
  }
  image: string
  description: string
  notes: string[]
  isHot: boolean
  sizes: string[]

  // Optional newer fields (admin-added perfumes)
  // - `variantPrices`: per-size pricing; keys should match `sizes`
  // - `inStock`: false means stock-out
  variantPrices?: Record<string, number>
  inStock?: boolean
}

// Auto-synced from MongoDB database
export const products: Product[] = []
    },
    "inStock": true
  }
]

export const categories = [
  { id: 'men', label: 'For Men', icon: '👨' },
  { id: 'women', label: 'For Women', icon: '👩' },
  { id: 'unisex', label: 'Unisex', icon: '👫' },
]
