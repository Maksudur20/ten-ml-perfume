import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    // Fetch all products from MongoDB
    const products = await productsCollection.find({}).toArray()

    // Transform MongoDB documents to Product interface
    const transformedProducts = products.map((doc: Record<string, unknown>) => {
      const priceObj = doc.price as Record<string, number> | undefined
      return {
        id: doc.id || (doc._id as { toString: () => string })?.toString() || Date.now().toString(),
        name: doc.name,
        brand: doc.brand,
        category: doc.category,
        price: {
          min: priceObj?.min || 0,
          max: priceObj?.max || 0,
        },
        image: doc.image,
        description: doc.description || '',
        notes: doc.notes || [],
        isHot: doc.isHot || false,
        sizes: doc.sizes || [],
        variantPrices: doc.variantPrices || {},
        inStock: doc.inStock !== false,
      }
    })

    // Generate TypeScript code for products.ts
    const productsCode = `export interface Product {
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
  // - \`variantPrices\`: per-size pricing; keys should match \`sizes\`
  // - \`inStock\`: false means stock-out
  variantPrices?: Record<string, number>
  inStock?: boolean
}

// Auto-synced from MongoDB database
export const products: Product[] = ${JSON.stringify(transformedProducts, null, 2)}

export const categories = [
  { id: 'men', label: 'For Men', icon: '👨' },
  { id: 'women', label: 'For Women', icon: '👩' },
  { id: 'unisex', label: 'Unisex', icon: '👫' },
]
`

    // Write to products.ts file
    const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.ts')
    await fs.writeFile(productsFilePath, productsCode, 'utf-8')

    // Create products folder if it doesn't exist
    const productsFolderPath = path.join(process.cwd(), 'src', 'data', 'products')
    try {
      await fs.mkdir(productsFolderPath, { recursive: true })
    } catch {
      // Folder might already exist
    }

    // Save each product as individual JSON file
    for (const product of transformedProducts) {
      const productFileName = `${product.id}.json`
      const productFilePath = path.join(productsFolderPath, productFileName)
      await fs.writeFile(productFilePath, JSON.stringify(product, null, 2), 'utf-8')
    }

    return NextResponse.json({
      status: 'success',
      message: 'Products synced to codebase and individual files created',
      syncedCount: transformedProducts.length,
      products: transformedProducts,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to sync products',
      },
      { status: 500 }
    )
  }
}
