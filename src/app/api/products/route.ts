import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// GET all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter object
    const filter: Record<string, any> = {}
    if (category) filter.category = category
    if (brand) filter.brand = brand

    const skip = (page - 1) * limit

    const products = await productsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const total = await productsCollection.countDocuments(filter)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

// POST new product (with image upload)
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume_store')
    const productsCollection = db.collection('products')

    const body = await request.json()
    const { name, brand, category, price, description, image, stock, volume, sizes, variantPrices, inStock } = body

    // Validation
    if (!name || !brand || !category || !price || !description || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product object
    const product = {
      id: Date.now().toString(),
      name,
      brand,
      category,
      price,
      description,
      image,
      notes: [],
      isHot: false,
      sizes: sizes || ['10ml'],
      variantPrices: variantPrices || {},
      inStock: inStock !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await productsCollection.insertOne(product as any)

    return NextResponse.json(
      {
        success: true,
        data: { ...product, _id: result.insertedId },
        message: 'Product created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    )
  }
}
