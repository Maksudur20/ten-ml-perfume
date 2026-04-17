import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Product from '@/models/Product'

// GET all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter object
    const filter: Record<string, string> = {}
    if (category) filter.category = category
    if (brand) filter.brand = brand

    const skip = (page - 1) * limit

    const products = await Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 })

    const total = await Product.countDocuments(filter)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
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
    await connectDB()

    const body = await request.json()
    const { name, brand, category, price, description, image, stock, volume } = body

    // Validation
    if (!name || !brand || !category || !price || !description || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product
    const product = new Product({
      name,
      brand,
      category,
      price,
      description,
      image,
      stock: stock || 0,
      volume: volume || 10,
    })

    await product.save()

    return NextResponse.json(
      {
        success: true,
        data: product,
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
